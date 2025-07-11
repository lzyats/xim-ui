<template>
  <a-drawer title="群组设置" :width="800" :open="visible" @close="onClose">
    <a-form ref="formRef" :model="updateForm" :rules="rules" :label-col="{ span: 6 }">
      <a-row :gutter="24" style="margin-bottom: 30px;">
        <a-divider>基本信息</a-divider>
        <a-col :span="12">
          <a-form-item label="群组头像" name="portrait">
            <a-upload v-model:file-list="fileList" name="file" :headers="{ Authorization: token }"
              list-type="picture-card" class="avatar-uploader" :action="REQUEST_PATH" :show-upload-list="false"
              @change="handleChange">
              <img :width="60" :height="60" :src="updateForm.portrait" alt="avatar" style="border-radius: 10px;" />
            </a-upload>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="群组名称" name="groupName" :rules="[{ required: true, message: '不能为空' }]">
            <a-input v-model:value="updateForm.groupName" />
          </a-form-item>
        </a-col>

        <a-divider>隐私设置</a-divider>
        <a-col :span="12">
          <a-form-item label="隐私编号" name="privacyNo" :rules="[{ required: true, message: '不能为空' }]">
            <a-radio-group v-model:value="updateForm.privacyNo">
              <a-radio value="Y">开启</a-radio>
              <a-radio value="N">关闭</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="隐私扫码" name="privacyScan" :rules="[{ required: true, message: '不能为空' }]">
            <a-radio-group v-model:value="updateForm.privacyScan">
              <a-radio value="Y">开启</a-radio>
              <a-radio value="N">关闭</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="隐私群名" name="privacyName" :rules="[{ required: true, message: '不能为空' }]">
            <a-radio-group v-model:value="updateForm.privacyName">
              <a-radio value="Y">开启</a-radio>
              <a-radio value="N">关闭</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>

        <a-divider>群组功能</a-divider>
        <a-col :span="12">
          <a-form-item label="成员保护" name="configMember" :rules="[{ required: true, message: '不能为空' }]">
            <a-radio-group v-model:value="updateForm.configMember">
              <a-radio value="Y">开启</a-radio>
              <a-radio value="N">关闭</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="成员邀请" name="configInvite" :rules="[{ required: true, message: '不能为空' }]">
            <a-radio-group v-model:value="updateForm.configInvite">
              <a-radio value="Y">开启</a-radio>
              <a-radio value="N">关闭</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="全员禁言" name="configSpeak" :rules="[{ required: true, message: '不能为空' }]">
            <a-radio-group v-model:value="updateForm.configSpeak">
              <a-radio value="Y">开启</a-radio>
              <a-radio value="N">关闭</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="显示头衔" name="configTitle" :rules="[{ required: true, message: '不能为空' }]">
            <a-radio-group v-model:value="updateForm.configTitle">
              <a-radio value="Y">开启</a-radio>
              <a-radio value="N">关闭</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="进群审核" name="configAudit" :rules="[{ required: true, message: '不能为空' }]">
            <a-radio-group v-model:value="updateForm.configAudit">
              <a-radio value="Y">开启</a-radio>
              <a-radio value="N">关闭</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="发送资源" name="configMedia" :rules="[{ required: true, message: '不能为空' }]">
            <a-radio-group v-model:value="updateForm.configMedia">
              <a-radio value="Y">开启</a-radio>
              <a-radio value="N">关闭</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="专属可见" name="configAssign" :rules="[{ required: true, message: '不能为空' }]">
            <a-radio-group v-model:value="updateForm.configAssign">
              <a-radio value="Y">开启</a-radio>
              <a-radio value="N">关闭</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="修改昵称" name="configNickname" :rules="[{ required: true, message: '不能为空' }]">
            <a-radio-group v-model:value="updateForm.configNickname">
              <a-radio value="Y">开启</a-radio>
              <a-radio value="N">关闭</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="发二维码" name="configScan" :rules="[{ required: true, message: '不能为空' }]">
            <a-radio-group v-model:value="updateForm.configScan">
              <a-radio value="Y">开启</a-radio>
              <a-radio value="N">关闭</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>

        <a-divider>红包设置</a-divider>
        <a-col :span="12">
          <a-form-item label="红包开关" name="configPacket" :rules="[{ required: true, message: '不能为空' }]">
            <a-radio-group v-model:value="updateForm.configPacket">
              <a-radio value="Y">开启</a-radio>
              <a-radio value="N">关闭</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="金额开关" name="configAmount" :rules="[{ required: true, message: '不能为空' }]">
            <a-radio-group v-model:value="updateForm.configAmount">
              <a-radio value="Y">开启</a-radio>
              <a-radio value="N">关闭</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="红包禁抢" name="configReceive" :rules="[{ required: true, message: '不能为空' }]">
            <a-radio-group v-model:value="updateForm.configReceive">
              <a-radio value="Y">开启</a-radio>
              <a-radio value="N">关闭</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>

        <a-divider>公告设置</a-divider>
        <a-col :span="12">
          <a-form-item label="公告开关" name="noticeTop" :rules="[{ required: true, message: '不能为空' }]">
            <a-radio-group v-model:value="updateForm.noticeTop">
              <a-radio value="Y">开启</a-radio>
              <a-radio value="N">关闭</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="公告内容" name="notice">
            <a-textarea v-model:value="updateForm.notice" :rows="2" :maxlength="200" />
          </a-form-item>
        </a-col>
      </a-row>

    </a-form>

    <div class="footer">
      <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
      <a-button type="primary" @click="onSubmit">提交</a-button>
    </div>
  </a-drawer>
</template>
<script setup>
import { ref, nextTick, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
import _ from 'lodash';
import { chatGroupApi } from '/@/api/chat/chat-group-api';
import SmartEnumSelect from '/@/components/framework/smart-enum-select/index.vue';
import { localRead } from '/@/lib/local-util';
import LocalStorageKeyConst from '/@/constants/local-storage-key-const.js';
// emit
const emit = defineEmits(['reloadList']);
const fileList = ref([]);
// 请求地址
const REQUEST_PATH = import.meta.env.VITE_APP_REQUEST + '/file/upload';
// 组件ref
const formRef = ref();
const loading = ref(false);
const formDefault = {
  configAmount: undefined,
  configAssign: undefined,
  configAudit: undefined,
  configInvite: undefined,
  configMedia: undefined,
  configMember: undefined,
  configNickname: undefined,
  configPacket: undefined,
  configReceive: undefined,
  configScan: undefined,
  configSpeak: undefined,
  configTitle: undefined,
  groupId: undefined,
  groupName: undefined,
  noticeTop: undefined,
  portrait: undefined,
  privacyNo: undefined,
  privacyScan: undefined,
  privacyName: undefined,
};
let updateForm = reactive({ ...formDefault });
let token = localRead(LocalStorageKeyConst.USER_TOKEN);
const rules = {
};
// 是否展示抽屉
const visible = ref(false);

function showDrawer(chatGroup) {
  visible.value = true;
  nextTick(() => {
    Object.assign(updateForm, chatGroup);
  });
}

function onClose() {
  Object.assign(updateForm, formDefault);
  visible.value = false;
}
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
function onSubmit() {
  formRef.value.validate()
    .then(async () => {
      SmartLoading.show();
      let params = _.cloneDeep(updateForm);
      await chatGroupApi.editGroupSetting(params);
      message.success(`操作成功`);
      onClose();
      emit('reloadList');
    });
}

defineExpose({
  showDrawer,
});

</script>
<style lang="less" scoped>
.footer {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e9e9e9;
  padding: 10px 16px;
  background: #fff;
  text-align: left;
  z-index: 1;
}
</style>