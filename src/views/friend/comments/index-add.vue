<template>
  <a-modal title="添加评论" :open="visible" @close="onClose" @ok="onSubmit" @cancel="onClose">
    <!-- 确保formRef正确绑定 -->
    <a-form ref="formRef" :model="updateForm" :rules="rules" :label-col="{ span: 5 }">
      <!-- 关联动态ID -->
      <a-form-item label="关联动态ID" name="momentId">
        <a-input v-model:value="updateForm.momentId" placeholder="关联动态ID" />
      </a-form-item>

      <!-- 评论用户 -->
      <a-form-item label="评论用户" name="userId">
        <a-select
          v-model:value="updateForm.userId"
          placeholder="请选择评论用户"
          show-search
          :filter-option="filterUser"
          :options="filteredUserList"
          style="width: 100%"
        >
          <template #option="option">
            {{ option.label || '未知用户' }}  <!-- 直接使用转换后的label -->
          </template>
        </a-select>
      </a-form-item>

      <!-- 回复的评论ID 改为下拉选择器 -->
      <a-form-item label="贴子用户ID" name="replyTo">
        <a-input v-model:value="updateForm.replyTo" placeholder="贴子用户ID" />
      </a-form-item>
      <a-form-item label="评论内容" name="content">
        <a-textarea v-model:value="updateForm.content" :maxlength="1000" placeholder="评论内容" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, nextTick, reactive, watch } from 'vue';
import { message } from 'ant-design-vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
import _, { now } from 'lodash';
import { friendCommentApi } from '/@/api/friend/friend-comments-api';
import { chatUserApi } from '/@/api/chat/chat-user-api';

// emit
const emit = defineEmits(['reloadList']);

// 组件ref
const formRef = ref();
const userIdy=0;

// 数据模型定义
const formDefault = {
  momentId: undefined,
  userId: undefined,
  replyTo: null,
  content: undefined,
  isDeleted: 0,
  source: 0,
  createTime: '2025-07-11 17:42:09'
};


const rules = {
  momentId: [{ required: true, message: '不能为空' }],
  userId: [{ required: true, message: '不能为空' }],
  content: [{ required: true, message: '不能为空' }],
  // 添加replyTo的验证规则
  replyTo: [
    { 
      validator: (_, value, callback) => {
        // 当replyTo有值时，检查是否与userId相等
        if (value && value === updateForm.userId) {
          callback(new Error('回复的评论ID不能与评论用户相同'));
        } else {
          callback();
        }
      }
    }
  ]
};

let updateForm = reactive({ ...formDefault });

// 用户列表相关 - 新增过滤相关变量
const userList = ref([]); // 原始用户列表
const filteredUserList = ref([]); // 过滤后的用户列表
const searchKeyword = ref(''); // 搜索关键词
const isUserLoaded = ref(false);

// 是否展示抽屉
const visible = ref(false);



// 加载用户列表
async function loadUserList() {
  try {
    SmartLoading.show();
    const response = await chatUserApi.queryListall();
    const originalUserList = response.rows || [];
    // 转换为 { value: userId, label: nickname } 结构
    userList.value = originalUserList.map(user => ({
      value: user.userId,  // 绑定到v-model的值
      label: user.nickname, // 下拉框显示的文本
      // 保留原始用户信息（可选，用于其他逻辑）
      ...user
    }));
    // 初始化过滤后的列表（同样是转换后的结构）
    filteredUserList.value = [...userList.value];
    isUserLoaded.value = true;
  } catch (error) {
    message.error('加载用户列表失败，请刷新重试');
    console.error('加载用户列表错误:', error);
  } finally {
    SmartLoading.hide();
  }
}


// 监听搜索关键词变化，实现本地搜索
watch(searchKeyword, (newVal) => {
  if (!newVal) {
    // 如果搜索词为空，显示全部用户
    filteredUserList.value = [...userList.value];
  } else {
    // 否则在本地列表中过滤
    const keyword = newVal.toLowerCase();
    filteredUserList.value = userList.value.filter(user => 
      user.nickname.toLowerCase().includes(keyword)
    );
  }
});

// 用户搜索过滤函数 - 改为更新搜索关键词
function filterUser(inputValue) {
  searchKeyword.value = inputValue || '';
  return true; // 返回true表示不使用默认过滤
}

async function showDrawer(momentID,userId) {
  visible.value = true;
  await loadUserList();
  // 确保formRef已初始化
  nextTick(() => {
    if (formRef.value) {  // 增加存在性判断
      formRef.value.clearValidate();
    }
    updateForm.momentId = momentID;
    updateForm.replyTo = userId;
    userIdy=userId;
    console.log(userIdy);
  });
}


function onClose() {
  Object.assign(updateForm, formDefault);
  visible.value = false;
  searchKeyword.value = ''; // 重置搜索关键词
}

function onSubmit() {
  formRef.value.validate()
    .then(async () => {
      SmartLoading.show();
      let params = _.cloneDeep(updateForm);
      // 确保 reply_to 为空时为 null
      params.replyTo = params.replyTo === '' ? null : params.replyTo;
      await friendCommentApi.addComment(params);
      message.success(`操作成功`);
      onClose();
      emit('reloadList');
    })
    .catch(() => {
      message.error('表单验证失败，请检查输入');
    });
}

defineExpose({
  showDrawer,
});
</script>