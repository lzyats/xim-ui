<template>
  <a-row class="smart-table-btn-block">
    <div class="smart-table-operate-block">
    </div>
    <div class="smart-table-setting-block">
      <TableOperator :refresh="queryViewRecord" :full="false" />
    </div>
  </a-row>
  <div>
    <a-table :columns="tableColumns" :dataSource="tableData" :pagination="false" :loading="tableLoading" size="small"
      bordered>
      <template #bodyCell="{ column, index }">
        <template v-if="column.dataIndex === 'rowIndex'">
          {{ index + 1 }}
        </template>
      </template>
    </a-table>
    <div class="smart-query-table-page">
      <a-pagination showSizeChanger showQuickJumper show-less-items :pageSizeOptions="PAGE_SIZE_OPTIONS"
        :defaultPageSize="queryForm.pageSize" v-model:current="queryForm.pageNum" v-model:pageSize="queryForm.pageSize"
        :total="total" @change="onPageChange" @showSizeChange="onPageChange" :show-total="(total) => `共${total}条`" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { chatUserApi } from '/@/api/chat/chat-user-api';
import { PAGE_SIZE_OPTIONS } from '/@/constants/common-const';
import { TableOperator, TABLE_ID } from '/@/components/table-operator';

const props = defineProps({
  userId: {
    type: [Number, String],
  },
});

const defaultQueryForm = {
  pageNum: 1,
  pageSize: 10,
};

const queryForm = reactive({ ...defaultQueryForm });

onMounted(queryViewRecord);

const tableColumns = [
  {
    title: '序号',
    dataIndex: 'rowIndex',
    width: 20,
    align: 'center',
  },
  {
    title: '交易类型',
    dataIndex: 'tradeTypeLabel',
    width: 100,
    align: 'center',
  },
  {
    title: '交易金额',
    dataIndex: 'tradeAmount',
    width: 100,
    align: 'center',
  },
  {
    title: '交易时间',
    dataIndex: 'createTime',
    width: 100,
    align: 'center',
  },

];

const tableData = ref([]);
const total = ref(0);
const tableLoading = ref(false);

async function queryViewRecord() {
  try {
    tableLoading.value = true;
    const queryResult = await chatUserApi.queryUserIncome(props.userId, queryForm);
    tableData.value = queryResult.rows;
    total.value = queryResult.total;
  } finally {
    tableLoading.value = false;
  }
}

// 监听分页事件
function onPageChange(currentPage, pageSize) {
  queryForm.pageNum = currentPage;
  queryForm.pageSize = pageSize;
  queryViewRecord();
}

watch(
  queryForm,
  () => {
    queryViewRecord();
  },
  { deep: true }
);

// 将分页事件处理器绑定到分页组件
</script>

<style scoped>
.smart-query-table-page {
  margin-top: 10px;
  text-align: right;
}
</style>