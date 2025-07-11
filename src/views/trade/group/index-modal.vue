<template>
  <div>
    <a-drawer title="手气红包" :width="800" :open="visible" :body-style="{ paddingBottom: '80px' }" @close="onClose">
      <a-table rowKey="userNo" :columns="tableColumns" :dataSource="tableData" :pagination="false"
        :loading="tableLoading" size="small" bordered>

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
          :defaultPageSize="queryForm.pageSize" v-model:current="queryForm.pageNum"
          v-model:pageSize="queryForm.pageSize" :total="total" @change="queryViewRecord"
          @showSizeChange="queryViewRecord" :show-total="(total) => `共${total}条`" />
      </div>
      <div class="footer">
        <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
      </div>
    </a-drawer>
  </div>
</template>
<script setup>
import { reactive, ref, watch } from 'vue';
import { tradeApi } from '/@/api/trade/trade-api';
import { TableOperator, TABLE_ID, PAGE_SIZE_OPTIONS } from '/@/components/table-operator';


const defaultQueryForm = {
  tradeId: undefined,
  pageNum: 1,
  pageSize: 10,
};

const queryForm = reactive({ ...defaultQueryForm });

defineExpose({
  showModal,
});
const visible = ref(false);
function onClose() {
  visible.value = false;
}
const tableColumns = [
  {
    title: '序号',
    dataIndex: 'rowIndex',
    width: 80,
    align: 'center',
  },
  {
    title: '领取金额',
    dataIndex: 'amount',
    align: 'center',
  },
  {
    title: '用户编号',
    dataIndex: 'userNo',
    align: 'center',
  },
  {
    title: '用户昵称',
    dataIndex: 'nickname',
    align: 'center',
  },
  {
    title: '领取时间',
    dataIndex: 'createTime',
    align: 'center',
  },
];
const tradedId = ref(null);
function showModal(tradeId) {
  visible.value = true;
  if (tradeId) {
    tradedId.value = tradeId;
    queryViewRecord();
  }
}
const tableData = ref([]);
const total = ref(0);
const tableLoading = ref(false);

async function queryViewRecord() {
  try {
    tableLoading.value = true;
    const queryResult = await tradeApi.queryTradeList(tradedId.value, queryForm);
    tableData.value = queryResult.rows;
    total.value = queryResult.total;
  } finally {
    tableLoading.value = false;
  }
}

// 在 `queryForm` 发生变化时重新请求数据
watch(
  queryForm,
  () => {
    queryViewRecord();
  },
  { deep: true }
);

// 绑定分页事件处理器
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