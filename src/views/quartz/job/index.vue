<!--
  * JOB 列表
-->
<template>
  <div>
    <a-form class="smart-query-form">
      <a-row class="smart-query-form-row">
        <a-form-item label="名称" class="smart-query-form-item">
          <a-input style="width: 150px" v-model:value="queryForm.jobName" placeholder="请输入名称" :maxlength="30"
            :allowClear=true />
        </a-form-item>
        <a-form-item label="任务状态" class="smart-query-form-item">
          <a-select style="width: 120px" v-model:value="queryForm.status" placeholder="请选择" :allowClear=true>
            <a-select-option value="Y">启用</a-select-option>
            <a-select-option value="N">禁用</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item class="smart-query-form-item smart-margin-left10">
          <a-button-group>
            <a-button type="primary" @click="searchQuery">
              <template #icon>
                <ReloadOutlined />
              </template>
              查询
            </a-button>
            <a-button @click="resetQuery">
              <template #icon>
                <SearchOutlined />
              </template>
              重置
            </a-button>
          </a-button-group>
        </a-form-item>
      </a-row>
    </a-form>

    <a-card size="small" :bordered="false" :hoverable="true">

      <a-row class="smart-table-btn-block">
        <div class="smart-table-operate-block">
          <a-button v-privilege="'quartz:job:add'" type="primary" @click="openUpdateModal">
            <template #icon>
              <PlusOutlined />
            </template>
            添加任务
          </a-button>
        </div>
        <div class="smart-table-setting-block">
          <TableOperator v-model="columns" :tableId="TABLE_ID.AC" :refresh="queryList" />
        </div>
      </a-row>

      <a-table size="small" :loading="tableLoading" bordered :dataSource="tableData" :columns="columns" rowKey="jobId"
        :pagination="false">
        <template #bodyCell="{ record, column, index }">

          <template v-if="column.dataIndex === 'rowIndex'">
            {{ index + 1 }}
          </template>

          <template v-if="column.dataIndex === 'status'">
            <a-tag v-if="record.status == 'Y'" color="success">启用</a-tag>
            <a-tag v-if="record.status == 'N'" color="error">禁用</a-tag>
          </template>

          <template v-if="column.dataIndex === 'action'">
            <div class="smart-table-operate">
              <a-button v-privilege="'quartz:job:remove'" danger type="link" @click="singleDelete(record)">删除</a-button>
              <a-button v-privilege="'quartz:job:edit'" @click="openUpdateModal(record)" type="link">编辑</a-button>
              <a-button v-privilege="'quartz:job:run'" type="link" @click="openExecuteModal(record)">执行</a-button>
            </div>
          </template>
        </template>
      </a-table>

      <div class="smart-query-table-page">
        <a-pagination showSizeChanger showQuickJumper show-less-items :pageSizeOptions="PAGE_SIZE_OPTIONS"
          :defaultPageSize="queryForm.pageSize" v-model:current="queryForm.pageNum"
          v-model:pageSize="queryForm.pageSize" :total="total" @change="queryList" @showSizeChange="queryList"
          :show-total="(total) => `共${total}条`" />
      </div>
    </a-card>

    <!-- 表单操作 -->
    <FormModal ref="formModal" @reloadList="queryList" />

  </div>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import { jobApi } from '/@/api/quartz/job-api';
import { TableOperator, TABLE_ID, PAGE_SIZE_OPTIONS } from '/@/components/table-operator';
import FormModal from './index-modal.vue';
import { message, Modal } from 'ant-design-vue';
import { SmartLoading } from '/@/components/framework/smart-loading';

const columns = ref([
  {
    title: '序号',
    dataIndex: 'rowIndex',
    width: 60,
    align: 'center',
  },
  {
    title: '任务名称',
    dataIndex: 'jobName',
    align: 'center',
  },
  {
    title: '执行方法',
    dataIndex: 'invokeTarget',
    align: 'center',
  },
  {
    title: '表达式',
    dataIndex: 'cronExpression',
    align: 'center',
  },
  {
    title: '下次执行',
    dataIndex: 'nextValidTime',
    align: 'center',
  },
  {
    title: '任务状态',
    dataIndex: 'status',
    width: 80,
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: 130,
    align: 'center',
  },
]);

// ---------------- 查询数据 -----------------------

const queryFormState = {
  jobName: '',
  status: undefined,
  pageNum: 1,
  pageSize: 10,
};
const queryForm = reactive({ ...queryFormState });

const tableLoading = ref(false);
const tableData = ref([]);
const total = ref(0);

function resetQuery() {
  Object.assign(queryForm, queryFormState);
  queryList();
}

// 重置分页条件
function searchQuery() {
  queryForm.pageNum = queryFormState.pageNum;
  queryList();
}

async function queryList() {
  try {
    tableLoading.value = true;
    let responseModel = await jobApi.queryList(queryForm);
    const list = responseModel.rows;
    total.value = responseModel.total;
    tableData.value = list;
  } finally {
    tableLoading.value = false;
  }
}

onMounted(queryList);

// ---------------- 批量 删除 -----------------

function singleDelete(record) {
  Modal.confirm({
    title: '确定要删除吗?',
    okText: '删除',
    okType: 'danger',
    onOk() {
      requestDelete(record.jobId);
    },
    cancelText: '取消',
    onCancel() { },
  });
}

async function requestDelete(jobId) {
  SmartLoading.show();
  await jobApi.deleteJob(jobId);
  message.success('删除成功');
  queryList();
}

// ------------------------------------ 表单操作 -------------------------------------
const formModal = ref();

// 打开更新表单
function openUpdateModal(record) {
  formModal.value.openUpdateModal(record);
}
// 打开执行表单
function openExecuteModal(record) {
  formModal.value.openExecuteModal(record);
}
</script>
