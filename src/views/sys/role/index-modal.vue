<template>
  <div>
    <!-- 编辑 -->
    <a-modal :open="updateModalShow" :width="650" :title="updateForm.roleId ? '编辑' : '添加'" ok-text="确认" cancel-text="取消"
      @cancel="closeUpdateModal" @ok="confirmUpdate">
      <a-form ref="updateFormRef" :model="updateForm" :rules="updateRules" :label-col="{ span: 5 }">
        <a-form-item label="角色名称" name="roleName">
          <a-input placeholder="请输入角色名称" v-model:value="updateForm.roleName" :maxlength="20" :showCount="true" />
        </a-form-item>
        <a-form-item label="角色字符" name="roleKey">
          <a-input placeholder="请输入角色备注" v-model:value="updateForm.roleKey" :maxlength="20" :showCount="true" />
        </a-form-item>
        <a-form-item label="角色备注" name="remark">
          <a-input placeholder="请输入角色备注" v-model:value="updateForm.remark" :maxlength="20" :showCount="true" />
        </a-form-item>
        <a-form-item label="角色排序" name="roleSort">
          <a-input-number v-model:value="updateForm.roleSort" :min="0" :max="9999" style="width: 100%" />
        </a-form-item>
        <a-form-item label="角色状态" name="status">
          <a-switch v-model:checked="updateForm.status" />
        </a-form-item>
        <a-form-item label="角色权限" name="perms">
          <a-tree checkable v-model:checkedKeys="updateForm.perms" v-model:selectedKeys="updateForm.perms"
            :tree-data="treeData">
            <template #title="{ title, key }">
              <span v-if="key === '0-0-1-0'" style="color: #1890ff">{{ title }}</span>
              <template v-else>{{ title }}</template>
            </template>
          </a-tree>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script setup>
import { message } from 'ant-design-vue';
import { reactive, ref, watch } from 'vue';
import { roleApi } from '/@/api/sys/role-api';
import { SmartLoading } from '/@/components/framework/smart-loading/index.js';

// emit
const emit = defineEmits(['reloadList']);

const updateModalShow = ref(false);
const updateFormRef = ref();
const treeData = ref([]);
const updateFormDefault = {
  roleId: null,
  roleName: '',
  roleKey: '',
  roleSort: 0,
  remark: '',
  status: true,
  perms: [],
};
let updateForm = reactive({ ...updateFormDefault });
const updateRules = {
  roleName: [{ required: true, message: '请输入' }],
  roleKey: [{ required: true, message: '请输入' }],
};

// 打开编辑弹框
function openUpdateModal(record) {
  Object.assign(updateForm, record);
  updateForm.status = record.status !== 'N';
  gettree(updateForm);
  updateModalShow.value = true;
}

async function gettree(updateForm) {
  if (updateForm.roleId) {
    const result = await roleApi.getMenuTree(updateForm.roleId);
    treeData.value = result.data.menus;
    updateForm.perms = result.data.perms;
  } else {
    const result = await roleApi.getMenuTree('0');
    treeData.value = result.data.menus;
    updateForm.perms = result.data.perms;
  }
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
    if (updateForm.roleId) {
      await roleApi.updateRole(updateForm);
    } else {
      await roleApi.addRole(updateForm);
    }
    message.success(updateForm.roleId ? '更新成功' : '新增成功');
    closeUpdateModal();
    emit('reloadList');
  });
}

defineExpose({
  openUpdateModal,
});
</script>
