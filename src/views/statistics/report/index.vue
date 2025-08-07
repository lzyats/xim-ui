<template>
  <a-form class="smart-query-form">
    <a-row class="smart-query-form-row">
      <a-form-item label="查询时间" class="smart-query-form-item">
        <a-date-picker valueFormat="YYYY-MM" picker="month" v-model:value="queryForm.beginTime" style="width: 150px" />
      </a-form-item>
      <a-form-item class="smart-query-form-item smart-margin-left10">
        <a-button-group>
          <a-button type="primary" @click="queryList">
            <template #icon>
              <SearchOutlined />
            </template>
            查询
          </a-button>
        </a-button-group>
      </a-form-item>
    </a-row>
  </a-form>
  <!---------- 查询表单form end ----------->

  <a-card size="small" :bordered="false" :hoverable="true">

    <!---------- 表格操作行 begin ----------->
    <a-row class="smart-table-btn-block">
      <div class="smart-table-operate-block">
      </div>
      <div class="smart-table-setting-block">
        <TableOperator v-model="columns" :tableId="TABLE_ID.BN" :refresh="queryList" />
      </div>
    </a-row>
    <!---------- 表格操作行 end ----------->

    <!---------- 表格 begin ----------->
    <a-table size="small" :dataSource="tableData" :columns="columns" rowKey="fileId" bordered :loading="tableLoading"
      :pagination="false">
      <template #bodyCell="{ column, index, record }">
        <template v-if="column.dataIndex === 'rowIndex'">
          <span>
            {{ index + 1 }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'disburse'">
          <!-- <div style="background-color: red;">
            <span>
              {{ record.disburse }}
            </span>
          </div> -->
          <a-tag v-if="record.income < record.disburse" color="error">{{ record.disburse }}</a-tag>
          <a-tag v-else color="success">{{ record.disburse }}</a-tag>
        </template>
      </template>
    </a-table>
  </a-card>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import { reportApi } from '/@/api/statistics/report-api';
import { TableOperator, TABLE_ID } from '/@/components/table-operator';

// ---------------------------- 表格列 ----------------------------

const columns = ref([
  {
    title: '序号',
    dataIndex: 'rowIndex',
    width: 80,
    align: 'center',
  },
  {
    title: '交易日期',
    dataIndex: 'label',
    width: 150,
    align: 'center',
  },
  {
    title: '充值汇总',
    dataIndex: 'income',
    align: 'center',
  },
  {
    title: '提现汇总',
    dataIndex: 'disburse',
    align: 'center',
  },
  {
    title: '消费汇总',
    dataIndex: 'consume',
    align: 'center',
  },
  {
    title: '服务费汇总',
    dataIndex: 'charge',
    align: 'center',
  },
  {
    title: '签到汇总',
    dataIndex: 'sign',
    align: 'center',
  },
  {
    title: '收入汇总',
    dataIndex: 'total',
    align: 'center',
  },
]);

const queryFormState = {
  beginTime: '2024-01',
};

// 查询表单form
const queryForm = reactive({ ...queryFormState });
// 表格加载loading
const tableLoading = ref(false);
// 表格数据
const tableData = ref([]);

async function queryList() {
  tableLoading.value = true;
  try {
    let queryResult = await reportApi.queryList(queryForm);
    tableData.value = queryResult.data;
  } finally {
    tableLoading.value = false;
  }
}

onMounted(() => {
  // 初始化
  const now = new Date()
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  queryForm.beginTime = year + '-' + month;
  // 初始化
  queryList();
});

</script>