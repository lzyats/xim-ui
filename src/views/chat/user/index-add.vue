<template>
  <a-modal title="添加" :open="visible" @close="onClose" @ok="onSubmit" @cancel="onClose">
    <a-form ref="formRef" :model="updateForm" :rules="rules" :label-col="{ span: 5 }">
      <a-form-item label="手机号码" name="phone">
        <a-input v-model:value="updateForm.phone" :maxlength="11" placeholder="手机号码" />
      </a-form-item>
      <a-form-item label="邮箱地址" name="email">
        <a-input v-model:value="updateForm.email" :maxlength="50" placeholder="邮箱地址" />
      </a-form-item>
      <a-form-item label="用户昵称" name="nickname">
        <a-input v-model:value="updateForm.nickname" :maxlength="15" placeholder="用户昵称" />
      </a-form-item>
      <a-form-item label="测试账号" name="special">
        <a-switch v-model:checked="updateForm.special" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup>
import { ref, nextTick, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
import _ from 'lodash';
import { chatUserApi } from '/@/api/chat/chat-user-api';
// emit
const emit = defineEmits(['reloadList']);
// 组件ref
const formRef = ref();
const formDefault = {
  phone: undefined,
  email: undefined,
  nickname: undefined,
  special: true,
};
let updateForm = reactive({ ...formDefault });
const rules = {
  phone: [{ required: true, message: '不能为空' }],
  nickname: [{ required: true, message: '不能为空' }],
};
// 是否展示抽屉
const visible = ref(false);

function showDrawer() {
  visible.value = true;
  nextTick(() => {
    formRef.value.clearValidate();
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
      params.special = params.special ? 'Y' : 'N';
      await chatUserApi.addUser(params);
      message.success(`操作成功`);
      onClose();
      emit('reloadList');
    });
}

defineExpose({
  showDrawer,
});
</script>