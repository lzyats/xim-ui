<template>
  <a-card title="清理资源">
    <a-form class="ant-advanced-search-form" :model="configform1" autocomplete="off" ref="updateFormRef1"
      :label-col="{ span: 5 }">
      <a-row :gutter="24">
        <a-col :span="10">
          <a-form-item label="发布时间" name="createTime">
            <a-date-picker :show-date="{ defaultValue: dayjs('00:00:00') }" valueFormat="YYYY-MM-DD"
              v-model:value="configform1.createTime" style="width: 100%" />
          </a-form-item>
        </a-col>
        <a-col>
          <a-form-item style="text-align: center;">
            <a-button type="primary" v-privilege="'operate:setting:edit'" @click="cleanPortrait">执行</a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-card>

  <a-card title="清理消息" style="margin-top: 15px;">
    <a-form class="ant-advanced-search-form" :model="configform2" autocomplete="off" ref="updateFormRef2"
      :label-col="{ span: 5 }">
      <a-row :gutter="24">
        <a-col :span="10">
          <a-form-item label="发布时间" name="createTime">
            <a-date-picker :show-date="{ defaultValue: dayjs('00:00:00') }" valueFormat="YYYY-MM-DD"
              v-model:value="configform2.createTime" style="width: 100%" />
          </a-form-item>
        </a-col>
        <a-col>
          <a-form-item style="text-align: center;">
            <a-button type="primary" v-privilege="'operate:setting:edit'" @click="cleanMsssage">执行</a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-card>

  <a-card title="清理交易" style="margin-top: 15px;">
    <a-form class="ant-advanced-search-form" :model="configform3" autocomplete="off" ref="updateFormRef3"
      :label-col="{ span: 5 }">
      <a-row :gutter="24">
        <a-col :span="10">
          <a-form-item label="发布时间" name="createTime">
            <a-date-picker :show-date="{ defaultValue: dayjs('00:00:00') }" valueFormat="YYYY-MM-DD"
              v-model:value="configform3.createTime" style="width: 100%" />
          </a-form-item>
        </a-col>
        <a-col>
          <a-form-item style="text-align: center;">
            <a-button type="primary" v-privilege="'operate:setting:edit'" @click="cleanTrade">执行</a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-card>

</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import { message, } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import { settingApi } from '/@/api/operate/setting-api';
import { SmartLoading } from '/@/components/framework/smart-loading/index.js';

// ---------------------------- 表格列 ----------------------------

// 表单form1
const updateFormRef1 = ref();
const configform1 = reactive({});

// 表单form2
const updateFormRef2 = ref();
const configform2 = reactive({});

// 表单form3
const updateFormRef3 = ref();
const configform3 = reactive({});

// 确认更新
async function cleanPortrait() {
  updateFormRef1.value.validate().then(async () => {
    SmartLoading.show();
    const result = await settingApi.cleanPortrait(configform1);
    message.success(result.msg);
  });
}

// 确认更新
async function cleanMsssage() {
  updateFormRef2.value.validate().then(async () => {
    SmartLoading.show();
    const result = await settingApi.cleanMsssage(configform2);
    message.success(result.msg);
  });
}
// 确认更新
async function cleanTrade() {
  updateFormRef3.value.validate().then(async () => {
    SmartLoading.show();
    const result = await settingApi.cleanTrade(configform3);
    message.success(result.msg);
  });
}

onMounted(() => {
  // 获取当前日期
  let now = new Date();
  // 设置上个月
  now.setMonth(now.getMonth() - 1);
  // 获取年份、月份、日
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  configform1.createTime = year + '-' + month + '-' + day;
  configform2.createTime = year + '-' + month + '-' + day;
  configform3.createTime = year + '-' + month + '-' + day;
});
</script>