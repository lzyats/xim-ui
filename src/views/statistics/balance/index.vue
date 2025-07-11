<template>
  <a-card size="small" :bordered="false" :hoverable="true">

    <!---------- 表格操作行 begin ----------->
    <a-row class="smart-table-btn-block">
      <div class="smart-table-operate-block">
        <a-button type="primary" @click="queryList">刷新</a-button>
      </div>
      <div class="smart-table-setting-block">
        <TableOperator v-model="columns" :refresh="queryList" />
      </div>
    </a-row>
    <!---------- 表格操作行 end ----------->

    <!---------- 表格 begin ----------->
    <a-table size="small" :dataSource="tableData" :columns="columns" rowKey="fileId" bordered :loading="tableLoading"
      :pagination="false">
    </a-table>
  </a-card>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { balanceApi } from '/@/api/statistics/balance-api';
import { TableOperator, TABLE_ID } from '/@/components/table-operator';

// ---------------------------- 表格列 ----------------------------
const sharedOnCell = (_, index) => {
  if (index == 0) {
    return { rowSpan: 3 };
  } else if (index < 3) {
    return { rowSpan: 0 };
  }
  return { rowSpan: 1 };
};

const columns = ref([
  {
    title: '收支汇总',
    align: 'center',
    colSpan: 2,
    children: [
      {
        title: '类型',
        dataIndex: 'type',
        align: 'center',
        customCell: sharedOnCell,
      },
      {
        title: '金额',
        dataIndex: 'amount',
        align: 'center',
        customCell: sharedOnCell,
      },

    ],
  },
  {
    title: '充值汇总',
    align: 'center',
    colSpan: 2,
    children: [
      {
        title: '通道',
        dataIndex: 'label',
        align: 'center',
      },
      {
        title: '金额',
        dataIndex: 'value',
        align: 'center',
      },
    ],
  },
]);

// 表格加载loading
const tableLoading = ref(false);
// 表格数据
const tableData = ref([]);

async function queryList() {
  tableLoading.value = true;
  try {
    let queryResult = await balanceApi.queryList();
    tableData.value = queryResult.data;
  } finally {
    tableLoading.value = false;
  }
}

onMounted(() => {
  queryList();
});

</script>