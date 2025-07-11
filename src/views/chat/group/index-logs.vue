<template>
  <a-row class="smart-table-btn-block">
    <div class="smart-table-operate-block">
    </div>
    <div class="smart-table-setting-block">
      <TableOperator :refresh="queryViewRecord" :full="false" />
    </div>
  </a-row>
  <div>
    <a-table rowKey="ID" :columns="tableColumns" :dataSource="tableData" :pagination="false" :loading="tableLoading"
      size="small" bordered>

      <template #bodyCell="{ column, index }">

        <template v-if="column.dataIndex === 'rowIndex'">
          <span>
            {{ index + 1 }}
          </span>
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
import { chatGroupApi } from '/@/api/chat/chat-group-api';
import { PAGE_SIZE_OPTIONS } from '/@/constants/common-const';
import { TableOperator, TABLE_ID } from '/@/components/table-operator';

const props = defineProps({
  groupId: {
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
    width: 60,
    align: 'center',
  },
  {
    title: '操作类型',
    dataIndex: 'logTypeLabel',
    width: 120,
    align: 'center',
  },
  {
    title: '操作内容',
    dataIndex: 'content',
    align: 'center',
  },
  {
    title: '操作时间',
    width: 200,
    dataIndex: 'createTime',
    align: 'center',
  },

];

const tableData = ref([]);
const total = ref(0);
const tableLoading = ref(false);

async function queryViewRecord() {
  try {
    tableLoading.value = true;
    const queryResult = await chatGroupApi.queryGroupLog(props.groupId, queryForm);
    tableData.value = queryResult.rows;
    total.value = queryResult.total;
  } catch (err) {
    console.error('Failed to fetch group data:', err);
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

</script>

<style scoped>
.smart-query-table-page {
  margin-top: 10px;
  text-align: right;
}
</style>