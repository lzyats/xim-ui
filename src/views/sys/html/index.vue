<template>
  <a-form class="smart-query-form">
    <a-row class="smart-query-form-row">
      <a-form-item label="网页标识" class="smart-query-form-item">
        <a-input style="width: 150px" v-model:value="queryForm.roulekey" placeholder="标题" :allowClear=true />
      </a-form-item>


      <a-form-item class="smart-query-form-item smart-margin-left10">
        <a-button-group>
          <a-button type="primary" @click="searchQuery">
            <template #icon>
              <SearchOutlined />
            </template>
            查询
          </a-button>
          <a-button @click="resetQuery">
            <template #icon>
              <ReloadOutlined />
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
        <a-button v-privilege="'operate:notice:add'" type="primary" @click="openUpdateModal">
          <template #icon>
            <PlusOutlined />
          </template>
          新增
        </a-button>
      </div>
      <div class="smart-table-setting-block">
        <TableOperator v-model="columns" :tableId="TABLE_ID.AZ" :refresh="queryList" />
      </div>
    </a-row>
    <!---------- 表格操作行 end ----------->

    <!---------- 表格 begin ----------->
    <a-table size="small" :dataSource="tableData" :columns="columns" rowKey="fileId" bordered :loading="tableLoading"
      :pagination="false">
      <template #bodyCell="{ record, column, index }">
        <template v-if="column.dataIndex === 'rowIndex'">
          <span>
            {{ index + 1 }}
          </span>
        </template>



        <template v-if="column.dataIndex === 'action'">
          <div class="smart-table-operate">
            <a-button @click="openUpdateModal(record)" v-privilege="'operate:notice:edit'" type="link">修改</a-button>
            <a-button @click="onDelete(record.noticeId)" danger v-privilege="'operate:notice:remove'" type="link">
              删除
            </a-button>
            <a-button @click="onCopy(record.noticeId)"  v-privilege="'operate:notice:edit'" type="link">
              复制
            </a-button>
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
  <!-- 表单操作 -->
  <FormModal ref="formModal" @reloadList="queryList" />
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import FormModal from './index-modal.vue';
import { message, Modal } from 'ant-design-vue';
import { noticeApi } from '/@/api/sys/html-api';
import { TableOperator, TABLE_ID, PAGE_SIZE_OPTIONS } from '/@/components/table-operator';

// ---------------------------- 表格列 ----------------------------

const columns = ref([
  {
    title: '序号',
    dataIndex: 'rowIndex',
    width: 80,
    align: 'center',
  },
  {
    title: '网页标识',
    dataIndex: 'roulekey',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '相关描述',
    dataIndex: 'remake',
    ellipsis: true,
    width: 100,
    align: 'center',
  },
  {
    title: '发布时间',
    dataIndex: 'ctime',
    width: 200,
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 200,
    fixed: 'right',
    align: 'center',
  },
]);

const queryFormState = {
  roulekey: undefined,
  roulekey: undefined,
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
  queryList();
}

// 重置分页条件
function searchQuery() {
  queryForm.pageNum = queryFormState.pageNum;
  queryList();
}

// 查询数据
const formModal = ref();

// 打开更新表单
function openUpdateModal(record) {
  formModal.value.openUpdateModal(record);
}
async function queryList() {
  tableLoading.value = true;
  try {
    let queryResult = await noticeApi.queryNoticeList(queryForm);
    tableData.value = queryResult.rows;
    total.value = queryResult.total;
  } finally {
    tableLoading.value = false;
  }
}

function onDelete(noticeId) {
  Modal.confirm({
    title: '提示',
    content: '确认删除该通知公告?',
    onOk() {
      deleteNotice(noticeId);
    },
  });
}
function onCopy(noticeId) {
  Modal.confirm({
    title: '提示',
    content: '确认复制该通知公告?',
    onOk() {
      noticeCopy(noticeId);
    },
  });
}

async function noticeCopy(noticeId) {
  try {
    tableLoading.value = true;
    await noticeApi.noticeCopy(noticeId);
    message.success('复制成功');
    queryList();
  } finally {
    tableLoading.value = false;
  }
}
// 删除API
async function deleteNotice(noticeId) {
  try {
    tableLoading.value = true;
    await noticeApi.noticeDelete(noticeId);
    message.success('删除成功');
    queryList();
  } finally {
    tableLoading.value = false;
  }
}

onMounted(queryList);

</script>