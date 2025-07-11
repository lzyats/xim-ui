<template>
  <div>
    <!-- 编辑 -->
    <a-modal :open="updateModalShow" :width="650" title="编辑" ok-text="确认" cancel-text="取消" @cancel="closeUpdateModal"
      @ok="confirmUpdate">
      <a-form ref="updateFormRef" :model="updateForm" :rules="updateRules" :label-col="{ span: 5 }">
        <a-form-item label="最新版本" name="version" help="版本格式，如：1.0.0">
          <a-input v-model:value="updateForm.version" :maxlength="20" :showCount="true" />
        </a-form-item>
        <a-form-item label="设备类型" name="deviceLabel">
          <a-input placeholder="设备类型" disabled v-model:value="updateForm.deviceLabel" />
        </a-form-item>

        <a-form-item label="下载地址" name="url">
          <a-input placeholder="下载地址" v-model:value="updateForm.url" :maxlength="100" :showCount="true" />
        </a-form-item>
        <a-form-item label="升级说明" name="content">
          <a-textarea placeholder="升级说明" v-model:value="updateForm.content" :rows="8" :maxlength="200"
            :showCount="true" />
        </a-form-item>
      </a-form>

    </a-modal>
  </div>
</template>
<script setup>
import { message } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import { versionApi } from '/@/api/operate/version-api';
import { SmartLoading } from '/@/components/framework/smart-loading/index.js';

// emit
const emit = defineEmits(['reloadList']);

const updateModalShow = ref(false);
const updateFormRef = ref();
const roleList = ref([]);

const updateFormDefault = {
  id: undefined,
  version: undefined,
  deviceLabel: undefined,
  url: undefined,
  content: undefined,
};
let updateForm = reactive({ ...updateFormDefault });
const updateRules = {
  version: [{ required: true, message: '请输入' }],
  content: [{ required: true, message: '请输入' }],
  deviceLabel: [{ required: true, message: '请输入' }],
  url: [{ required: true, message: '请输入' }],
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
    await versionApi.versionEdit(updateForm);
    message.success('修改成功');
    closeUpdateModal();
    emit('reloadList');
  });
}

defineExpose({
  openUpdateModal,
});
</script>