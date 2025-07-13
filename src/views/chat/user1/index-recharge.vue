<template>
  <a-modal :open="visible" title="账号充值" ok-text="确认" cancel-text="取消" @ok="onSubmit" @cancel="onClose">
    <a-form ref="formRef" :model="updateForm" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 14 }">
      <a-form-item label="金额" name="amount" help="充值范围[-999999～999999]">
        <a-input-number v-model:value="updateForm.amount" :min="-999999" :max="999999" style="width: 100%"
          placeholder="请输入金额" />
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

function showModal(userId) {
  visible.value = true;
  nextTick(() => {
    formRef.value.resetFields();
    formRef.value.clearValidate();
    updateForm.userId = userId;
  });
}

function onClose() {
  visible.value = false;
}

// ------------------------------ 表单 ------------------------------

const formDefault = {
  userId: undefined,
  amount: '',
};
let updateForm = reactive({ ...formDefault });
const rules = {
  amount: [{ required: true, message: '金额不能为空' }],
};

function onSubmit() {
  formRef.value.validate()
    .then(async () => {
      SmartLoading.show();
      await chatUserApi.userRecharge(updateForm);
      message.success(`操作成功`);
      emit('reloadList');
      onClose();
    });
}

defineExpose({
  showModal,
});
</script>