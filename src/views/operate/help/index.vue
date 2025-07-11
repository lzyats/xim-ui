<template>
  <a-form class="smart-query-form">
    <a-row class="smart-query-form-row">
      <a-form-item label="标题" class="smart-query-form-item">
        <a-input style="width: 150px" v-model:value="queryForm.title" placeholder="标题" :allowClear=true />
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
    <a-row class="smart-table-btn-block">
      <div class="smart-table-operate-block">
        <a-button v-privilege="'operate:help:add'" type="primary" @click="openUpdateModal">
          <template #icon>
            <PlusOutlined />
          </template>
          新增
        </a-button>
      </div>
      <div class="smart-table-setting-block">
        <TableOperator v-model="columns" :tableId="TABLE_ID.BA" :refresh="queryList" />
      </div>

    </a-row>
    <!---------- 表格 begin ----------->
    <a-table size="small" :dataSource="tableData" :columns="columns" rowKey="fileId" bordered :loading="tableLoading"
      :pagination="false">
      <template #bodyCell="{ record, column, index }">
        <template v-if="column.dataIndex === 'rowIndex'">
          <span>
            {{ index + 1 }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'title'">
          <span>
            {{ record.title }} <br />
            {{ record.content }}
          </span>
        </template>

        <template v-if="column.dataIndex === 'action'">
          <div class="smart-table-operate">
            <a-button @click="openUpdateModal(record)" v-privilege="'operate:help:edit'" type="link">修改</a-button>
            <a-button @click="onDelete(record.helpId)" danger v-privilege="'operate:help:remove'" type="link">
              删除
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
import { helpApi } from '/@/api/operate/help-api';
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
    title: '标题',
    dataIndex: 'title',
    ellipsis: true,
  },
  {
    title: '排序',
    dataIndex: 'sort',
    ellipsis: true,
    width: 100,
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

const queryFormState = {
  title: undefined,
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

const formModal = ref();

// 打开更新表单
function openUpdateModal(record) {
  formModal.value.openUpdateModal(record);
}
async function queryList() {
  tableLoading.value = true;
  try {
    let queryResult = await helpApi.queryHelpList(queryForm);
    tableData.value = queryResult.rows;
    total.value = queryResult.total;
  } finally {
    tableLoading.value = false;
  }
}

function onDelete(helpId) {
  Modal.confirm({
    title: '提示',
    content: '确认删除该通知公告?',
    onOk() {
      deleteHelp(helpId);
    },
  });
}

// 删除API
async function deleteHelp(helpId) {
  try {
    tableLoading.value = true;
    await helpApi.helpDelete(helpId);
    message.success('删除成功');
    queryList();
  } finally {
    tableLoading.value = false;
  }
}

onMounted(queryList);

</script>