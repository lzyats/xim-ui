<!--
  * 登录日志
-->
<template>
  <!---------- 查询表单form begin ----------->
  <a-form class="smart-query-form">
    <a-row class="smart-query-form-row">
      <a-form-item label="用户账号" class="smart-query-form-item">
        <a-input style="width: 150px" v-model:value="queryForm.username" placeholder="请输入用户账号" :allowClear=true />
      </a-form-item>

      <a-form-item label="登录状态" class="smart-query-form-item">
        <a-select style="width: 120px" v-model:value="queryForm.status" placeholder="请选择" :allowClear=true>
          <a-select-option value="Y">成功</a-select-option>
          <a-select-option value="N">失败</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="执行时间" class="smart-query-form-item">
        <a-range-picker v-model:value="chooseTimeRange" :presets="defaultTimeRanges" style="width: 240px"
          @change="onChangeCreateTime" />
      </a-form-item>
      <a-form-item class="smart-query-form-item">
        <a-button-group>
          <a-button type="primary" @click="searchQuery">
            <template #icon>
              <ReloadOutlined />
            </template>
            查询
          </a-button>
          <a-button @click="resetQuery" class="smart-margin-left10">
            <template #icon>
              <SearchOutlined />
            </template>
            重置
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
        <a-button @click="confirmBatchDelete" danger :disabled="selectedRowKeyList.length === 0"
          v-privilege="'sys:login:remove'">
          <template #icon>
            <DeleteOutlined />
          </template>
          批量删除
        </a-button>
      </div>
      <div class="smart-table-setting-block">
        <TableOperator v-model="columns" :tableId="TABLE_ID.AA" :refresh="queryList" />
      </div>
    </a-row>
    <!---------- 表格操作行 end ----------->

    <!---------- 表格 begin ----------->
    <a-table size="small" :dataSource="tableData" :columns="columns" rowKey="logId" bordered :pagination="false"
      :row-selection="{ selectedRowKeys: selectedRowKeyList, onChange: onSelectChange }">
      <template #bodyCell="{ record, column, index }">

        <template v-if="column.dataIndex === 'rowIndex'">
          {{ index + 1 }}
        </template>

        <template v-if="column.dataIndex === 'status'">
          <a-tag v-if="record.status == 'Y'" color="success">成功</a-tag>
          <a-tag v-if="record.status == 'N'" color="error">失败</a-tag>
        </template>

        <template v-if="column.dataIndex === 'ipAddr'">
          {{ record.ipAddr }}<br />{{ record.location }}
        </template>

        <template v-if="column.dataIndex === 'browser'">
          {{ record.os }}<br />{{ record.browser }}
        </template>

        <template v-if="column.dataIndex === 'action'">
          <div class="smart-table-operate" v-privilege="'sys:login:remove'">
            <a-button danger type="link" @click="singleDelete(record)">删除</a-button>
          </div>
        </template>
      </template>
    </a-table>
    <!---------- 表格 end ----------->

    <div class="smart-query-table-page">
      <a-pagination showSizeChanger showQuickJumper show-less-items :pageSizeOptions="PAGE_SIZE_OPTIONS"
        :defaultPageSize="queryForm.pageSize" v-model:current="queryForm.pageNum" v-model:pageSize="queryForm.pageSize"
        :total="total" @change="queryList" @showSizeChange="queryList" :show-total="(total) => `共${total}条`" />
    </div>

  </a-card>
</template>
<script setup>
import { reactive, ref, onMounted } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { logApi } from '/@/api/sys/login-api';
import { TableOperator, TABLE_ID, PAGE_SIZE_OPTIONS } from '/@/components/table-operator';
import { defaultTimeRanges } from '/@/lib/default-time-ranges';
// ---------------------------- 表格列 ----------------------------

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
    title: '登录IP',
    dataIndex: 'ipAddr',
    align: 'center',
  },
  {
    title: '浏览器',
    dataIndex: 'browser',
    align: 'center',
  },
  {
    title: '登录内容',
    dataIndex: 'message',
    align: 'center',
  },
  {
    title: '登录时间',
    dataIndex: 'createTime',
    align: 'center',
  },
  {
    title: '登录状态',
    dataIndex: 'status',
    width: 80,
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    align: 'center',
    width: 90,
  },
]);

// ---------------------------- 查询数据表单和方法 ----------------------------

const queryFormState = {
  username: undefined,
  status: undefined,
  beginTime: undefined,
  endTime: undefined,
  pageNum: 1,
  pageSize: 10,
};
// 查询表单form
const queryForm = reactive({ ...queryFormState });
// 表格加载loading
const tableLoading = ref(false);
// 表格数据
const tableData = ref([]);
// 总数
const total = ref(0);

// 重置查询条件
function resetQuery() {
  let pageSize = queryForm.pageSize;
  Object.assign(queryForm, queryFormState);
  queryForm.pageSize = pageSize;
  chooseTimeRange.value = [];
  queryList();
}

// 重置分页条件
function searchQuery() {
  queryForm.pageNum = queryFormState.pageNum;
  queryList();
}

// 查询数据
async function queryList() {
  tableLoading.value = true;
  try {
    let queryResult = await logApi.queryList(queryForm);
    tableData.value = queryResult.rows;
    total.value = queryResult.total;
  } finally {
    tableLoading.value = false;
  }
}
const chooseTimeRange = ref([]);

function onChangeCreateTime(value, dateStrings) {
  queryForm.beginTime = dateStrings[0];
  queryForm.endTime = dateStrings[1];
}

onMounted(queryList);

// ---------------------------- 单个删除 ----------------------------
function singleDelete(record) {
  Modal.confirm({
    title: '确定要删除吗?',
    okText: '删除',
    okType: 'danger',
    onOk() {
      requestDelete(record.logId);
    },
    cancelText: '取消',
    onCancel() { },
  });
}

async function requestDelete(param) {
  SmartLoading.show();
  await logApi.delete(param);
  message.success('删除成功');
  queryList();
}

// ---------------------------- 批量删除 ----------------------------

// 选择表格行
const selectedRowKeyList = ref([]);

function onSelectChange(selectedRowKeys) {
  selectedRowKeyList.value = selectedRowKeys;
}

// 批量删除
function confirmBatchDelete() {
  Modal.confirm({
    title: '提示',
    content: '确定要批量删除这些数据吗?',
    okText: '删除',
    okType: 'danger',
    onOk() {
      requestDelete(selectedRowKeyList.value);
    },
    cancelText: '取消',
    onCancel() { },
  });
}
</script>