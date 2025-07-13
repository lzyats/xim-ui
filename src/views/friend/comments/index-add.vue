<template>
  <a-modal title="添加评论" :open="visible" @close="onClose" @ok="onSubmit" @cancel="onClose">
    <a-form ref="formRef" :model="updateForm" :rules="rules" :label-col="{ span: 5 }">
      <!-- 优化后表单字段命名 -->
      <a-form-item label="关联动态ID" name="momentId">
        <a-input v-model:value="updateForm.momentId" placeholder="关联动态ID" />
      </a-form-item>

      <a-form-item label="评论用户ID" name="userId">
        <a-input v-model:value="updateForm.userId" placeholder="评论用户ID" />
      </a-form-item>

      <a-form-item label="回复的评论ID" name="replyTo">
        <a-input v-model:value="updateForm.replyTo" placeholder="回复的评论ID（可为空）" />
      </a-form-item>
      <a-form-item label="评论内容" name="content">
        <a-textarea v-model:value="updateForm.content" :maxlength="1000" placeholder="评论内容" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, nextTick, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
import _, { now } from 'lodash';
import { friendCommentApi } from '/@/api/friend/friend-comments-api';

// emit
const emit = defineEmits(['reloadList']);

// 组件ref
const formRef = ref();

// 数据模型定义优化
const formDefault = {
  momentId: undefined,
  userId: undefined,
  replyTo: null,
  content: undefined,
  isDeleted:0,
  source:0,
  createTime:'2025-07-11 17:42:09'
};

const rules = {
  momentId: [{ required: true, message: '不能为空' }],
  userId: [{ required: true, message: '不能为空' }],
  content: [{ required: true, message: '不能为空' }],
};

let updateForm = reactive({ ...formDefault });


// 是否展示抽屉
const visible = ref(false);

function showDrawer(momentID) {
  visible.value = true;
  nextTick(() => {
    formRef.value.clearValidate();
    updateForm.momentId = momentID;
  });
}

function onClose() {
  Object.assign(updateForm, formDefault);
  visible.value = false;
}

function onSubmit() {
  formRef.value.validate()
    .then(async () => {
      SmartLoading.show();
      let params = _.cloneDeep(updateForm);
      // 确保 reply_to 为空时为 null
      params.replyTo = params.replyTo === '' ? '' : params.replyTo;
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