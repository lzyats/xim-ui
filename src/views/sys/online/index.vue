<template>
  <a-card size="small" :bordered="false" :hoverable="true" style="height: 100%">

    <a-row class="smart-table-btn-block">
      <div class="smart-table-operate-block">
        <a-button type="primary" @click="searchQuery">刷新</a-button>
      </div>
      <div class="smart-table-setting-block">
        <TableOperator v-model="columns" :tableId="TABLE_ID.BR" :refresh="queryList" />
      </div>
    </a-row>

    <a-table size="small" :loading="tableLoading" :dataSource="tableData" :columns="columns" bordered
      rowKey="operateLogId" :pagination="false">
      <template #bodyCell="{ record, column, index }">

        <template v-if="column.dataIndex === 'username'">
          <div>{{ record.username }} </div>
          <div v-if="token == record.token">（当前用户）</div>
        </template>

        <template v-if="column.dataIndex === 'browser'">
          <div>{{ record.browser }} <br /> {{ record.os }} </div>
        </template>

        <template v-if="column.dataIndex === 'location'">
          <div>{{ record.ipAddr }} <br /> {{ record.location }} </div>
        </template>

        <template v-if="column.dataIndex === 'rowIndex'">
          {{ index + 1 }}
        </template>

        <template v-else-if="column.dataIndex === 'action'">
          <div class="smart-table-operate" v-privilege="'sys:online:logout'">
            <a-button danger type="link" @click="singleDelete(record)">强退</a-button>
          </div>
        </template>
      </template>
    </a-table>

    <div class="smart-query-table-page">
      <a-pagination showSizeChanger showQuickJumper show-less-items :pageSizeOptions="PAGE_SIZE_OPTIONS"
        :defaultPageSize="queryForm.pageSize" v-model:current="queryForm.pageNum" v-model:pageSize="queryForm.pageSize"
        :total="total" @change="queryList" @showSizeChange="queryList" :show-total="(total) => `共${total}条`" />
    </div>

  </a-card>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import { onlineApi } from '/@/api/sys/online-api';
import { message, Modal } from 'ant-design-vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { TableOperator, TABLE_ID, PAGE_SIZE_OPTIONS } from '/@/components/table-operator';
import { localRead } from '/@/lib/local-util';
import LocalStorageKeyConst from '/@/constants/local-storage-key-const.js';

let token = localRead(LocalStorageKeyConst.USER_TOKEN);

const columns = ref([
  {
    title: '序号',
    dataIndex: 'rowIndex',
    width: 60,
    align: 'center',
  },
  {
    title: '用户账号',
    dataIndex: 'username',
    align: 'center',
  },
  {
    title: 'IP地址',
    dataIndex: 'location',
    align: 'center',
  },
  {
    title: '操作系统',
    dataIndex: 'browser',
    align: 'center',
  },
  {
    title: '登录时间',
    dataIndex: 'loginTime',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    width: 80,
  },
]);

const queryFormState = {
  pageNum: 1,
  pageSize: 10,
};
const queryForm = reactive({ ...queryFormState });
const tableLoading = ref(false);
const tableData = ref([]);
const total = ref(0);

// 重置分页条件
function searchQuery() {
  queryForm.pageNum = queryFormState.pageNum;
  queryList();
}

async function queryList() {
  try {
    tableLoading.value = true;
    let responseModel = await onlineApi.queryList(queryForm);
    const list = responseModel.rows;
    total.value = responseModel.total;
    tableData.value = list;
  } finally {
    tableLoading.value = false;
  }
}

onMounted(queryList);

// ---------------------- 强退 ----------------------
function singleDelete(record) {
  Modal.confirm({
    title: '确定要退出当前账号吗?',
    okText: '强退',
    okType: 'danger',
    onOk() {
      requestLogout(record.token);
    },
    cancelText: '取消',
    onCancel() { },
  });
}

async function requestLogout(token) {
  SmartLoading.show();
  await onlineApi.logout(token);
  message.success('退出成功');
  queryList();
}
</script>
