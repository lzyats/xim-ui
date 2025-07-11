<template>
  <div>
    <!-- 编辑 -->
    <a-modal :open="updateModalShow" :width="650" :title="updateForm.noticeId ? '编辑' : '添加'" ok-text="确认"
      cancel-text="取消" @cancel="closeUpdateModal" @ok="confirmUpdate">
      <a-form ref="updateFormRef" :model="updateForm" :rules="updateRules" :label-col="{ span: 5 }">
        <a-form-item label="公告标题" name="title">
          <a-input placeholder="标题" v-model:value="updateForm.title" :maxlength="20" :showCount="true" />
        </a-form-item>
        <a-form-item label="公告内容" name="content">
          <a-textarea placeholder="内容" v-model:value="updateForm.content" :maxlength="20" :showCount="true" />
        </a-form-item>

        <a-form-item label="是否启用" name="status" :rules="[{ required: true, message: '不能为空' }]">
          <a-radio-group v-model:value="updateForm.status">
            <a-radio value="Y">启用</a-radio>
            <a-radio value="N">关闭</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="发布时间" name="createTime">
          <a-date-picker :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }" valueFormat="YYYY-MM-DD HH:mm:ss"
            v-model:value="updateForm.createTime" style="width: 100%" />
        </a-form-item>

      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { message } from 'ant-design-vue';
import { reactive, ref, watchEffect } from 'vue';
import { noticeApi } from '/@/api/operate/notice-api';
import dayjs, { Dayjs } from 'dayjs';
import { SmartLoading } from '/@/components/framework/smart-loading/index.js';

// emit
const emit = defineEmits(['reloadList']);

const updateModalShow = ref(false);
const updateFormRef = ref();
const roleList = ref([]);

const updateFormDefault = {
  noticeId: undefined,
  title: undefined,
  status: 'Y',
  content: undefined,
  createTime: undefined,
};
let updateForm = reactive({ ...updateFormDefault });

const updateRules = {
  title: [{ required: true, message: '请输入标题' }],
  content: [{ required: true, message: '请输入内容' }],
  createTime: [{ required: true, message: '请输入发布时间' }],
};


// 打开编辑弹框
function openUpdateModal(record) {
  Object.assign(updateForm, record);
  updateModalShow.value = true;
}

// 关闭编辑弹框
function closeUpdateModal() {
  Object.assign(updateForm, updateFormDefault);
  updateModalShow.value = false;
}

// 确认更新
async function confirmUpdate() {
  updateFormRef.value.validate().then(async () => {
    SmartLoading.show();
    if (updateForm.noticeId) {
      await noticeApi.noticeEdit(updateForm);
    } else {
      await noticeApi.noticeAdd(updateForm);
    }
    message.success(updateForm.noticeId ? '更新成功' : '新增成功');
    closeUpdateModal();
    emit('reloadList');
  });
}



defineExpose({
  openUpdateModal,
});
</script>