<template>
  <div>
    <!-- 编辑 -->
    <a-modal :open="updateModalShow" :width="650" :title="updateForm.robotId ? '编辑' : '添加'" ok-text="确认"
      cancel-text="取消" @cancel="closeUpdateModal" @ok="confirmUpdate">
      <a-form ref="updateFormRef" :model="updateForm" :rules="updateRules" :label-col="{ span: 5 }">
        <a-form-item label="头像" name="portrait">
          <a-upload v-model:file-list="fileList" name="file" :headers="{ Authorization: token }"
            list-type="picture-card" class="avatar-uploader" :action="REQUEST_PATH" :show-upload-list="false"
            @change="handleChange">
            <img v-if="updateForm.portrait" :width="60" :src="updateForm.portrait" alt="avatar" />
            <div v-else>
              <loading-outlined v-if="loading"></loading-outlined>
              <plus-outlined v-else></plus-outlined>
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item label="名称" name="nickname">
          <a-input v-model:value="updateForm.nickname" placeholder="名称" />
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
import { localRead } from '/@/lib/local-util';
import LocalStorageKeyConst from '/@/constants/local-storage-key-const.js';

const emit = defineEmits(['reloadList']);

const fileList = ref([]);
const loading = ref(false);
// 请求地址
const REQUEST_PATH = import.meta.env.VITE_APP_REQUEST + '/file/upload';

async function handleChange(info) {
  if (info.file.status === 'uploading') {
    loading.value = true;
    return;
  }
  if (info.file.status === 'done') {
    const { response } = info.file;
    updateForm.portrait = response.data.filePath;
    loading.value = false;
  }
  if (info.file.status === 'error') {
    message.error(`${info.file.name} 文件上传失败.`);
    loading.value = false;
  }
}

const updateModalShow = ref(false);
const updateFormRef = ref();

const updateFormDefault = {
  robotId: undefined,
  portrait: undefined,
  nickname: undefined,
};
let token = localRead(LocalStorageKeyConst.USER_TOKEN);
let updateForm = reactive({ ...updateFormDefault });
const updateRules = {
  portrait: [{ required: true, message: '请输入' }],
  nickname: [{ required: true, message: '请输入' }],
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
    await robotApi.robotEdit(updateForm);
    message.success(updateForm.robotId ? '更新成功' : '新增成功');
    closeUpdateModal();
    emit('reloadList');
  });
}

defineExpose({
  openUpdateModal,
});
</script>