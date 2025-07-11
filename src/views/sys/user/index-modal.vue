<template>
  <div>
    <!-- 编辑 -->
    <a-modal :open="updateModalShow" :width="650" :title="updateForm.userId ? '编辑' : '添加'" ok-text="确认" cancel-text="取消"
      @cancel="closeUpdateModal" @ok="confirmUpdate">
      <a-form ref="updateFormRef" :model="updateForm" :rules="updateRules" :label-col="{ span: 5 }">
        <a-form-item label="用户账号" name="username">
          <a-input placeholder="请输入用户账号" v-model:value="updateForm.username" :maxlength="20" :showCount="true"
            :disabled="updateForm.userId" />
        </a-form-item>
        <a-form-item label="用户昵称" name="nickname">
          <a-input placeholder="请输入用户昵称" v-model:value="updateForm.nickname" :maxlength="20" :showCount="true" />
        </a-form-item>
        <a-form-item label="用户角色" name="roleId">
          <a-select v-model:value="updateForm.roleId" placeholder="请选择用户角色">
            <a-select-option v-for="item in roleList" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="用户备注" name="remark">
          <a-input placeholder="请输入用户备注" v-model:value="updateForm.remark" :maxlength="20" :showCount="true" />
        </a-form-item>
        <a-form-item label="用户状态" name="status">
          <a-switch v-model:checked="updateForm.status" />
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

// emit
const emit = defineEmits(['reloadList']);

const updateModalShow = ref(false);
const updateFormRef = ref();
const roleList = ref([]);

const updateFormDefault = {
  userId: null,
  roleId: undefined,
  username: '',
  nickname: '',
  remark: '',
  status: true,
};
let updateForm = reactive({ ...updateFormDefault });
const updateRules = {
  username: [{ required: true, message: '请输入用户账号' }],
  roleId: [{ required: true, message: '请选择对应角色' }],
};

// 打开编辑弹框
function openUpdateModal(record) {
  Object.assign(updateForm, record);
  updateForm.status = record.status !== 'N';
  queryRoleList();
  updateModalShow.value = true;
}

async function queryRoleList() {
  let responseModel = await userApi.queryRoleList();
  roleList.value = responseModel.data;
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
    updateForm.status = updateForm.status ? 'Y' : 'N';
    if (updateForm.userId) {
      await userApi.updateUser(updateForm);
    } else {
      await userApi.addUser(updateForm);
    }
    message.success(updateForm.userId ? '更新成功' : '新增成功');
    closeUpdateModal();
    emit('reloadList');
  });
}

defineExpose({
  openUpdateModal,
});
</script>
