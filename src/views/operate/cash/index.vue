<template>
  <a-card title="提现配置">
    <a-form class="ant-advanced-search-form" :model="cashConfigform" autocomplete="off" ref="updateFormRef">
      <a-row :gutter="24">
        <a-col :span="10">
          <a-form-item label="提现手续费率" name="rate" :rules="[{ required: true, message: '不能为空' }]">
            <a-input-number v-model:value="cashConfigform.rate" addon-after="%" :min="0" :max="100">
            </a-input-number>
          </a-form-item>
          <a-form-item label="最小提现金额" name="min" :rules="[{ required: true, message: '不能为空' }]">
            <a-input-number v-model:value="cashConfigform.min" addon-after="元" :min="0" :max="100000">
            </a-input-number>
          </a-form-item>
          <a-form-item label="每日提现上限" name="count" :rules="[{ required: true, message: '不能为空' }]">
            <a-input-number v-model:value="cashConfigform.count" addon-after="次" :min="0" :max="1000">
            </a-input-number>
          </a-form-item>
          <a-form-item label="今日美元汇率" name="rates" :rules="[{ required: true, message: '不能为空' }]">
            <a-input-number v-model:value="cashConfigform.rates" addon-after="元" :min="0" :max="100000">
            </a-input-number>
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <a-form-item label="提现增值服务" name="cost" :rules="[{ required: true, message: '不能为空' }]">
            <a-input-number v-model:value="cashConfigform.cost" addon-after="元" :min="0" :max="100000">
            </a-input-number>
          </a-form-item>
          <a-form-item label="最大提现金额" name="max" :rules="[{ required: true, message: '不能为空' }]">
            <a-input-number v-model:value="cashConfigform.max" addon-after="元" :min="0" :max="100000">
            </a-input-number>
          </a-form-item>
          <a-form-item label="提现必须实名" name="auth" :rules="[{ required: true, message: '不能为空' }]">
            <a-radio-group v-model:value="cashConfigform.auth">
              <a-radio value="Y">实名</a-radio>
              <a-radio value="N">匿名</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="17">
          <a-form-item label="提现友情提示" name="remark" :rules="[{ required: true, message: '不能为空' }]">
            <a-textarea v-model:value="cashConfigform.remark" :rows="2" :maxlength="200" />
          </a-form-item>
          <a-form-item style="text-align: center;">
            <a-button type="primary" v-privilege="'operate:cash:edit'" @click="confirmUpdate">保存</a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import { message, } from 'ant-design-vue';
import { cashApi } from '/@/api/operate/cash-api';
import { SmartLoading } from '/@/components/framework/smart-loading/index.js';

// ---------------------------- 表格列 ----------------------------

const cashConfigformState = {
  auth: undefined,
  count: undefined,
  cost: undefined,
  max: undefined,
  min: undefined,
  rate: undefined,
  rates: undefined,
  remark: undefined,
};
const updateFormRef = ref();
// 查询表单form
const cashConfigform = reactive({ ...cashConfigformState });

async function queryData() {
  try {
    let versionConfig = await cashApi.cashGetConfig();
    Object.assign(cashConfigform, versionConfig.data);
  } finally {
  }
}

// 确认更新
async function confirmUpdate() {
  updateFormRef.value.validate().then(async () => {
    SmartLoading.show();
    await cashApi.cashConfigEdit(cashConfigform);
    message.success('保存成功');
    queryData();
  });
}

onMounted(queryData);
</script>