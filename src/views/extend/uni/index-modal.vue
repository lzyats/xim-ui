<template>
  <div>
    <!-- 编辑 -->
    <a-modal :open="updateModalShow" :width="650" :title="updateForm.uniId ? '编辑' : '添加'" ok-text="确认" cancel-text="取消"
      @cancel="closeUpdateModal" @ok="confirmUpdate">
      <a-form ref="updateFormRef" :model="updateForm" :rules="updateRules" :label-col="{ span: 5 }">
        <a-form-item label="应用名称" name="name" help="建议输入4个字">
          <a-input placeholder="应用名称" v-model:value="updateForm.name" :maxlength="10" :showCount="true" />
        </a-form-item>
        <a-form-item label="应用图标" name="icon">
          <a-upload v-model:file-list="fileList" name="file" :headers="{ Authorization: token }"
            list-type="picture-card" class="avatar-uploader" :action="REQUEST_PATH" :show-upload-list="false"
            @change="(info) => handleUpload(info, 'icon')">
            <img v-if="updateForm.icon" :width="60" :src="updateForm.icon" alt="avatar" />
            <div v-else>
              <loading-outlined v-if="iconLoading"></loading-outlined>
              <plus-outlined v-else></plus-outlined>
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item label="应用类型" name="type">
          <a-radio-group v-model:value="updateForm.type" :disabled="!!updateForm.uniId">
            <a-radio value="mini">小程序</a-radio>
            <a-radio value="url">网址</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="应用ID" name="appId" v-if="updateForm.type === 'mini'"
          help="输入uniapp对应的appId，如：__UNI__E28E421">
          <a-input placeholder="应用ID" v-model:value="updateForm.appId" :maxlength="20" :showCount="true" />
        </a-form-item>
        <a-form-item label="版本号" name="version" v-if="updateForm.type === 'mini'" help="取值范围100～999999">
          <a-input-number placeholder="版本号" v-model:value="updateForm.version" :min="100" :max="999999"
            style="width: 50%" />
        </a-form-item>
        <a-form-item label="访问网址" name="path" v-if="updateForm.type === 'url'">
          <a-input placeholder="访问网址" v-model:value="updateForm.path" :maxlength="200" :showCount="true" />
        </a-form-item>
        <a-form-item label="小程序包" name="path" v-if="updateForm.type === 'mini'">
          <div class="mini-upload">
            <a-upload v-model:file-list="xcxFileList" name="file" :headers="{ Authorization: token }"
              :action="REQUEST_PATH" :show-upload-list="false" @change="(info) => handleUpload(info, 'mini')">
              <a-button v-if="!updateForm.path">
                <upload-outlined></upload-outlined>
                小程序包
              </a-button>
            </a-upload>
            <div v-if="updateForm.path" class="file-info">
              <div class="file-path">
                <div>{{ updateForm.path }}
                  <a-button type="link" @click="handleDeleteMini" danger>
                    <delete-outlined />
                    删除
                  </a-button>
                </div>
              </div>
            </div>
          </div>
        </a-form-item>
        <a-form-item label="是否启用" name="status">
          <a-radio-group v-model:value="updateForm.status">
            <a-radio value="Y">是</a-radio>
            <a-radio value="N">否</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { message } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import { LoadingOutlined, PlusOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { uniApi } from '../../../api/extend/uni-api';
import { SmartLoading } from '/@/components/framework/smart-loading/index.js';
import { localRead } from '/@/lib/local-util';
import LocalStorageKeyConst from '/@/constants/local-storage-key-const.js';
const emit = defineEmits(['reloadList']);

const fileList = ref([]);
const xcxFileList = ref([]);
const iconLoading = ref(false);
const miniLoading = ref(false);
// 请求地址
const REQUEST_PATH = import.meta.env.VITE_APP_REQUEST + '/file/upload';
let token = localRead(LocalStorageKeyConst.USER_TOKEN);

async function handleUpload(info, type) {
  const loadingRef = type === 'icon' ? iconLoading : miniLoading;

  if (info.file.status === 'uploading') {
    loadingRef.value = true;
    return;
  }
  if (info.file.status === 'done') {
    const { response } = info.file;
    if (type === 'icon') {
      updateForm.icon = response.data.filePath;
      iconLoading.value = false;
    } else if (type === 'mini') {
      updateForm.path = response.data.filePath;
      miniLoading.value = false;
    }
    loadingRef.value = false;
  }
  if (info.file.status === 'error') {
    message.error(`${info.file.name} 文件上传失败.`);
    loadingRef.value = false;
  }
}

// 删除小程序文件
function handleDeleteMini() {
  updateForm.path = '';
  xcxFileList.value = [];
}

const updateModalShow = ref(false);
const updateFormRef = ref();

const updateForm = reactive({
  uniId: '',
  icon: '',
  status: 'Y',
  type: 'mini',
  appId: '',
  version: '',
  path: '',
  name: ''
});

const updateRules = {
  name: [{ required: true, message: '请输入应用名称' }],
  icon: [{ required: true, message: '请上传应用图标' }],
  type: [{ required: true, message: '请选择应用类型' }],
  status: [{ required: true, message: '请选择是否启用' }],
  appId: [{ required: true, message: '请输入应用ID' }],
  version: [{ required: true, message: '请输入版本号' }],
  path: [{ required: true, message: '请上传小程序文件' }]
};

// 打开编辑弹框
async function openUpdateModal(record) {
  updateModalShow.value = true;
  if (record) {
    Object.assign(updateForm, record);
  }
}

// 关闭编辑弹框
function closeUpdateModal() {
  updateModalShow.value = false;
  updateFormRef.value?.resetFields();
  Object.assign(updateForm, {
    uniId: '',
    icon: '',
    status: 'Y',
    type: 'mini',
    appId: '',
    version: '',
    path: ''
  });
  // 清空文件列表
  fileList.value = [];
  xcxFileList.value = [];
}

// 确认更新
async function confirmUpdate() {
  try {
    await updateFormRef.value?.validate();
    SmartLoading.show();
    if (updateForm.uniId) {
      await uniApi.uniItemEdit(updateForm);
    } else {
      await uniApi.uniItemAdd(updateForm);
    }
    closeUpdateModal();
    emit('reloadList');
    message.success('操作成功');
  } catch (e) {
    console.error(e);
  } finally {
    SmartLoading.hide();
  }
}

defineExpose({
  openUpdateModal,
});
</script>

<style scoped>
.mini-upload .file-path {
  flex: 1;
  word-break: break-all;
  margin-right: 8px;
}

.mini-upload .file-path {
  flex: 1;
  word-break: break-all;
  margin-right: 8px;
}
</style>