<template>
  <div>
    <!-- 编辑 -->
    <a-modal :open="updateModalShow" :width="650" :title="updateForm.replyId ? '编辑' : '添加'" ok-text="确认"
      cancel-text="取消" @cancel="closeUpdateModal" @ok="confirmUpdate">
      <a-form ref="updateFormRef" :model="updateForm" :rules="updateRules" :label-col="{ span: 5 }">
        <a-form-item label="关键词" name="replyKey">
          <a-textarea v-model:value="updateForm.replyKey" placeholder="关键词" />
        </a-form-item>
        <a-form-item label="回复信息" name="content">
          <a-textarea v-model:value="updateForm.content" placeholder="回复信息" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script setup>
import { message } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import { robotApi } from '../../../api/extend/robot-api';
import { SmartLoading } from '/@/components/framework/smart-loading/index.js';

const emit = defineEmits(['reloadList']);

const updateModalShow = ref(false);
const updateFormRef = ref();

const updateFormDefault = {
  robotId: undefined,
  replyId: undefined,
  replyKey: undefined,
  content: undefined,
};
let updateForm = reactive({ ...updateFormDefault });
const updateRules = {
  replyKey: [{ required: true, message: '请输入' }],
  content: [{ required: true, message: '请输入' }],
};

// 打开编辑弹框
function openUpdateModal(record) {
  Object.assign(updateForm, record);
  updateForm.replyKey = record.replyKey;
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
    updateForm.replyKey = updateForm.replyKey;
    if (updateForm.replyId) {
      await robotApi.editEven(updateForm);
    } else {
      await robotApi.addEven(updateForm);
    }
    message.success(updateForm.replyId ? '更新成功' : '新增成功');
    closeUpdateModal();
    emit('reloadList');
  });
}

defineExpose({
  openUpdateModal,
});
</script>