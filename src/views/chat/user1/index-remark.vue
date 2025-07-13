<template>
  <a-modal :open="visible" title="用户备注" ok-text="确认" cancel-text="取消" @ok="onSubmit" @cancel="onClose">
    <a-form ref="formRef" :model="updateForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 14 }">
      <a-form-item label="用户备注" name="remark">
        <a-textarea v-model:value="updateForm.remark" placeholder="用户备注" :rows="3" :maxlength="200" show-count />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup>
import { ref, nextTick, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { chatUserApi } from '/@/api/chat/chat-user-api';

// emit
const emit = defineEmits(['reloadList']);

//  组件
const formRef = ref();

// ------------------------------ 显示 、隐藏 ------------------------------

// 是否展示抽屉
const visible = ref(false);

function showModal(userId, remark) {
  visible.value = true;
  nextTick(() => {
    formRef.value.resetFields();
    formRef.value.clearValidate();
    updateForm.userId = userId;
    updateForm.remark = remark;
  });
}

function onClose() {
  visible.value = false;
}

// ------------------------------ 表单 ------------------------------

const formDefault = {
  userId: undefined,
  remark: '',
};
let updateForm = reactive({ ...formDefault });
function onSubmit() {
  formRef.value.validate()
    .then(async () => {
      SmartLoading.show();
      await chatUserApi.userRemark(updateForm);
      message.success(`操作成功`);
      emit('reloadList');
      onClose();
    });
}

defineExpose({
  showModal,
});
</script>