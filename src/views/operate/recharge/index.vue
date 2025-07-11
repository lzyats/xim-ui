<template>
  <a-card title="充值配置">
    <a-form class="ant-advanced-search-form" :model="rechargeForm" autocomplete="off" ref="updateFormRef"
      :label-col="{ span: 5 }">
      <a-row :gutter="24">
        <a-col :span="10">
          <a-form-item label="充值次数" name="count" :rules="[{ required: true, message: '充值次数' }]" help="单人每日最大充值次数">
            <a-input-number v-model:value="rechargeForm.count" :min="1" :max="1000" addon-after="次"
              style="width: 60%;"></a-input-number>
          </a-form-item>
          <a-form-item label="安卓配置" name="android" help="安卓充值开关">
            <a-checkbox-group v-model:value="rechargeForm.android">
              <a-checkbox value="1" name="android">支付宝</a-checkbox>
              <a-checkbox value="2" name="android">微信</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
          <a-form-item label="苹果配置" name="ios" help="苹果充值开关">
            <a-checkbox-group v-model:value="rechargeForm.ios">
              <a-checkbox value="1" name="ios">支付宝</a-checkbox>
              <a-checkbox value="2" name="ios">微信</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <a-form-item label="总充值金额" name="amount" :rules="[{ required: true, message: '总充值金额' }]" help="每日总充值金额">
            <a-input-number v-model:value="rechargeForm.amount" :min="0" :max="999999" addon-after="元"
              style="width: 90%;"></a-input-number>
          </a-form-item>
          <a-form-item label="总充值时间" name="timeRange" :rules="[{ required: true, message: '总充值时间' }]"
            help="充值时间范围00:00:00～23:59:59">
            <a-time-range-picker v-model:value="rechargeForm.timeRange" valueFormat="HH:mm:ss"
              :placeholder="['开始时间', '结束时间']" style="width: 90%;" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" v-privilege="'operate:recharge:edit'" @click="confirmUpdate">保存</a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
  <!---------- 查询表单form end ----------->

  <a-card size="small" :bordered="false" :hoverable="true" style="margin-top: 15px;">

    <!---------- 表格操作行 begin ----------->
    <a-row class="smart-table-btn-block">
      <div class="smart-table-operate-block">
      </div>
      <div class="smart-table-setting-block">
        <TableOperator v-model="columns" :tableId="TABLE_ID.BF" :refresh="queryList" />
      </div>
    </a-row>
    <!---------- 表格操作行 end ----------->

    <!---------- 表格 begin ----------->
    <a-table size="small" :dataSource="tableData" :columns="columns" rowKey="fileId" bordered :loading="tableLoading"
      :pagination="false">
      <template #bodyCell="{ record, column }">

        <template v-if="column.dataIndex === 'status'">
          <a-tag v-if="record.status == 'Y'" color="success">启用</a-tag>
          <a-tag v-if="record.status == 'N'" color="error">禁用</a-tag>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <div class="smart-table-operate" v-privilege="'operate:recharge:edit'">
            <a-button @click="openUpdateModal(record)" type="link">修改</a-button>
          </div>
        </template>
      </template>
    </a-table>
  </a-card>
  <!-- 表单操作 -->
  <FormModal ref="formModal" @reloadList="queryList" />
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import FormModal from './index-modal.vue';
import { message, } from 'ant-design-vue';
import { rechargeApi } from '/@/api/operate/recharge-api';
import { SmartLoading } from '/@/components/framework/smart-loading/index.js';
import ARow from 'ant-design-vue/lib/grid/Row';
import { TableOperator, TABLE_ID, PAGE_SIZE_OPTIONS } from '/@/components/table-operator';

// ---------------------------- 表格列 ----------------------------

const columns = ref([
  {
    title: '排序',
    dataIndex: 'level',
    ellipsis: true,
    width: 80,
    align: 'center',
  },
  {
    title: '充值金额',
    dataIndex: 'amount',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '启用状态',
    dataIndex: 'status',
    ellipsis: true,
    width: 200,
    align: 'center',
  },

  {
    title: '操作',
    dataIndex: 'action',
    width: 120,
    fixed: 'right',
    align: 'center',
  },
]);
const rechargeFormState = {
  amount: undefined,
  timeRange: undefined,
  count: undefined,
  android: [],
  ios: [],
};
const updateFormRef = ref();
// 查询表单form
const rechargeForm = reactive({ ...rechargeFormState });
// 表格加载loading
const tableLoading = ref(false);
// 表格数据
const tableData = ref([]);

const formModal = ref();

// 打开更新表单
function openUpdateModal(record) {
  formModal.value.openUpdateModal(record);
}
async function queryList() {
  tableLoading.value = true;
  try {
    let queryResult = await rechargeApi.queryRechargeList();
    tableData.value = queryResult.data;
    let versionConfig = await rechargeApi.rechargeGetConfig();
    rechargeForm.amount = versionConfig.data.amount;
    rechargeForm.timeRange = versionConfig.data.timeRange;
    rechargeForm.count = versionConfig.data.count;
    rechargeForm.android = versionConfig.data.android.split(',');
    rechargeForm.ios = versionConfig.data.ios.split(',');
  } finally {
    tableLoading.value = false;
  }
}

// 确认更新
async function confirmUpdate() {
  updateFormRef.value.validate().then(async () => {
    SmartLoading.show();
    rechargeForm.android = rechargeForm.android.toString();
    rechargeForm.ios = rechargeForm.ios.toString();
    await rechargeApi.editRechargeConfig(rechargeForm);
    message.success('修改成功');
    queryList();
  });
}

onMounted(queryList);

</script>