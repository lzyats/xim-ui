<template>
  <a-modal :open="visible" title="修改密码" ok-text="确认" cancel-text="取消" @ok="updatePwd" @cancel="cancelModal">
    <a-form ref="formRef" :model="updateForm" :rules="rules" :label-col="{ span: 5 }">
      <a-form-item label="原密码" name="oldPwd">
        <a-input v-model:value.trim="updateForm.oldPwd" type="password" placeholder="请输入原密码" />
      </a-form-item>
      <a-form-item label="新密码" name="newPwd">
        <a-input v-model:value.trim="updateForm.newPwd" type="password" placeholder="请输入新密码" />
      </a-form-item>
      <a-form-item label="确认密码" name="confirmPass">
        <a-input v-model:value.trim="updateForm.confirmPass" type="password" placeholder="请输入确认密码" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup>
import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { userApi } from '/@/api/sys/user-api';
import { md5 } from '/@/lib/encrypt';

const visible = ref(false);
const formRef = ref();

const rules = {
  oldPwd: [{ required: true, message: '请输入原密码' }],
  newPwd: [{ required: true, message: '请输入新密码' }],
  confirmPass: [{ required: true, message: '请输入确认密码' }],
};

const formDefault = {
  oldPwd: undefined,
  newPwd: undefined,
  confirmPass:undefined,
};
let updateForm = reactive({
  ...formDefault,
});

async function updatePwd() {
  formRef.value.validate()
    .then(async () => {
      if (updateForm.newPwd != updateForm.confirmPass) {
        message.error('新密码与确认密码不一致');
        return;
      }
      const formData = {
        oldPwd: md5(updateForm.oldPwd),
        newPwd: md5(updateForm.newPwd),
    };
      SmartLoading.show();
      await userApi.updatePwd(formData);
      message.success('修改成功');
      visible.value = false;
    });
}

function showModal() {
  visible.value = true;
  updateForm.oldPass = '';
  updateForm.newPass = '';
  updateForm.confirmPass = '';
}

function cancelModal() {
  visible.value = false;
}

defineExpose({ showModal });
</script>
