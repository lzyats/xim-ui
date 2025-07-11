<template>
  <div>
    <!-- 编辑 -->
    <a-modal :open="updateModalShow" :width="650" title="重置密码" ok-text="确认" cancel-text="取消" @cancel="closeUpdateModal"
      @ok="confirmUpdate">
      <a-form ref="updateFormRef" :model="updateForm" :rules="updateRules" :label-col="{ span: 5 }">
        <a-form-item label="用户密码" name="password">
          <a-input placeholder="请输入密码" v-model:value="updateForm.password" :maxlength="20" :showCount="true" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script setup>
import { message } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import { userApi } from '/@/api/sys/user-api';
import { SmartLoading } from '/@/components/framework/smart-loading/index.js';
import { md5 } from '/@/lib/encrypt';

// emit
const emit = defineEmits(['reloadList']);

const updateModalShow = ref(false);
const updateFormRef = ref();

const updateFormDefault = {
  userId: undefined,
  password: undefined,
};

let updateForm = reactive({ ...updateFormDefault });
const updateRules = {
  password: [{ required: true, message: '请输入密码' }],
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
    const formData = {
      userId: updateForm.userId,
      password: md5(updateForm.password),
    };
    await userApi.resetPwd(formData);
    message.success('重置成功');
    closeUpdateModal();
    emit('reloadList');
  });
}

defineExpose({
  openUpdateModal,
});
</script>
