<template>
  <a-card title="配置中心">
    <a-form class="ant-advanced-search-form" :model="configform" autocomplete="off" ref="updateFormRef"
      :label-col="{ span: 5 }">
      <a-row :gutter="24">
        <a-col :span="10">
          <a-form-item label="项目名称" name="project" :rules="[{ required: true, message: '不能为空' }]" help="显示项目名称">
            <a-input v-model:value="configform.project" :maxlength="10" :showCount="true" />
          </a-form-item>
          <a-form-item label="注销日期" name="deleted" :rules="[{ required: true, message: '不能为空' }]" help="用户注销后，重新注册等待时间">
            <a-input-number style="width: 100%;" v-model:value="configform.deleted" addon-after="天" :min="0" :max="100"
              :maxlength="20" />
          </a-form-item>
          <a-form-item label="申请好友" name="applyFriend" :rules="[{ required: true, message: '不能为空' }]" help="单日申请好友上限">
            <a-input-number style="width: 100%;" v-model:value="configform.applyFriend" addon-after="次" :min="0"
              :max="1000" />
          </a-form-item>
          <a-form-item label="用户注册" name="register" :rules="[{ required: true, message: '不能为空' }]"
            help="控制app端，是否允许用户注册">
            <a-radio-group v-model:value="configform.register">
              <a-radio value="Y">开启</a-radio>
              <a-radio value="N">关闭</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="实名手持" name="holdCard" :rules="[{ required: true, message: '不能为空' }]"
            help="控制app端，实名认证是否需要手持身份证">
            <a-radio-group v-model:value="configform.holdCard">
              <a-radio value="Y">开启</a-radio>
              <a-radio value="N">关闭</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="系统截屏" name="screenshot" :rules="[{ required: true, message: '不能为空' }]"
            help="控制app端，是否允许用户截屏">
            <a-radio-group v-model:value="configform.screenshot">
              <a-radio value="Y">允许</a-radio>
              <a-radio value="N">禁止</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="短信开关" name="sms" :rules="[{ required: true, message: '不能为空' }]" help="开启测试短信，任意手机号均可登录">
            <a-radio-group v-model:value="configform.sms">
              <a-radio value="Y">正式短信</a-radio>
              <a-radio value="N">测试短信</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>

        <a-col :span="10">
          <a-form-item label="后端验证" name="captcha" :rules="[{ required: true, message: '不能为空' }]"
            help="管理端4位验证码，如验证码为5，则需填写51234">
            <a-input-number style="width: 100%;" v-model:value="configform.captcha" :maxlength="4" :minlength="4" />
          </a-form-item>
          <a-form-item label="红包金额" name="packet" :rules="[{ required: true, message: '不能为空' }]" help="单人、群组红包最大金额">
            <a-input-number style="width: 100%;" v-model:value="configform.packet" addon-after="元" :min="0" :max="9999"
              :maxlength="20" />
          </a-form-item>
          <a-form-item label="申请群聊" name="applyGroup" :rules="[{ required: true, message: '不能为空' }]" help="单日申请加群上限">
            <a-input-number style="width: 100%;" v-model:value="configform.applyGroup" addon-after="次" :min="0"
              :max="1000" :maxlength="20">
            </a-input-number>
          </a-form-item>
          <a-form-item label="撤回时间" name="recall" :rules="[{ required: true, message: '不能为空' }]" help="消息撤回时间，单位分钟">
            <a-input-number style="width: 100%;" v-model:value="configform.recall" addon-after="分钟" :min="0" :max="1000"
              :maxlength="20">
            </a-input-number>
          </a-form-item>
          <a-form-item label="注册昵称" name="nickname" help="设置内容后，新注册用户会使用此昵称，否则会使用手机号">
            <a-input v-model:value="configform.nickname" :maxlength="20" :showCount="true" />
          </a-form-item>
          <a-form-item label="备案信息" name="beian" help="设置内容后，app上会显示对应备案信息">
            <a-input v-model:value="configform.beian" :maxlength="20" :showCount="true" />
          </a-form-item>
          <a-form-item label="水印文字" name="watermark" help="设置内容后，app上会显示对应水印文字">
            <a-input v-model:value="configform.watermark" :maxlength="8" :showCount="true" />
          </a-form-item>
        </a-col>

        <a-col :span="10">
          <a-form-item label="分享地址" name="share" :rules="[{ required: true, message: '不能为空' }]"
            help="APP分享功能对应的地址，一般用于软件下载页">
            <a-textarea v-model:value="configform.share" :rows="4" :maxlength="200" :showCount="true" />
          </a-form-item>
        </a-col>

        <a-col :span="10">
          <a-form-item label="推送地址" name="hook" help="重要消息推送地址，默认使用[企业微信]进行接收，可输入多行">
            <a-textarea v-model:value="configform.hook" :rows="4" :maxlength="200" :showCount="true" />
          </a-form-item>
        </a-col>

        <a-col :span="10">
          <a-form-item style="text-align: center;">
            <a-button type="primary" v-privilege="'operate:config:edit'" @click="confirmUpdate">保存</a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import { message, } from 'ant-design-vue';
import { configApi } from '/@/api/operate/config-api';
import { SmartLoading } from '/@/components/framework/smart-loading/index.js';

// ---------------------------- 表格列 ----------------------------

const configformState = {
  applyFriend: undefined,
  recall: undefined,
  applyGroup: undefined,
  deleted: undefined,
  register: undefined,
  sms: undefined,
  beian: undefined,
  nickname: undefined,
  project: undefined,
  screenshot: undefined,
  watermark: undefined,
  captcha: undefined,
  packet: undefined,
  share: undefined,
  hook: undefined,
};
const updateFormRef = ref();
// 查询表单form
const configform = reactive({ ...configformState });

async function queryData() {
  try {
    let versionConfig = await configApi.configGetConfig();
    Object.assign(configform, versionConfig.data);
  } finally {
  }
}

// 确认更新
async function confirmUpdate() {
  updateFormRef.value.validate().then(async () => {
    SmartLoading.show();
    await configApi.configConfigEdit(configform);
    message.success('保存成功');
    queryData();
  });
}

onMounted(queryData);
</script>