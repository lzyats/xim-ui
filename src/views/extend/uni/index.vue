<template>
  <a-form class="smart-query-form">
    <a-row class="smart-query-form-row">
      <a-form-item label="应用名称" class="smart-query-form-item">
        <a-input style="width: 150px" v-model:value="queryForm.name" placeholder="应用名称" :allowClear=true />
      </a-form-item>
      <a-form-item label="应用ID" class="smart-query-form-item">
        <a-input style="width: 150px" v-model:value="queryForm.appId" placeholder="应用ID" :allowClear=true />
      </a-form-item>
      <a-form-item label="应用类型" class="smart-query-form-item">
        <a-select style="width: 120px" v-model:value="queryForm.type" placeholder="请选择" :allowClear=true>
          <a-select-option value="mini">小程序</a-select-option>
          <a-select-option value="url">网址</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="是否启用" class="smart-query-form-item">
        <a-select style="width: 120px" v-model:value="queryForm.status" placeholder="请选择" :allowClear=true>
          <a-select-option value="Y">启用</a-select-option>
          <a-select-option value="N">禁用</a-select-option>
        </a-select>
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
        <a-button v-privilege="'extend:uni:add'" type="primary" @click="openUpdateModal">
          <template #icon>
            <PlusOutlined />
          </template>
          新增
        </a-button>
      </div>
      <div class="smart-table-setting-block">
        <TableOperator v-model="columns" :tableId="TABLE_ID.BP" :refresh="queryList" />
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
        <template v-if="column.dataIndex === 'name'">
          <div>
            {{ record.name }}
          </div>
          <div>
            {{ record.appId }}
          </div>
        </template>
        <template v-if="column.dataIndex === 'version'">
          <div v-if="record.type == 'mini'">
            应用版本：{{ record.version }}
          </div>
          <div v-else>
            访问地址：{{ record.path }}
          </div>
        </template>
        <template v-if="column.dataIndex === 'icon'">
          <span>
            <a-image :width="60" :height="60" :src="record.icon" style="border-radius: 10px;" />
          </span>
        </template>
        <template v-if="column.dataIndex === 'status'">
          <a-tag v-if="record.status == 'Y'" color="success">启用</a-tag>
          <a-tag v-if="record.status == 'N'" color="error">禁用</a-tag>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <div class="smart-table-operate">
            <a-button @click="openUpdateModal(record)" v-privilege="'extend:uni:edit'" type="link">修改</a-button>
            <a-button @click="onDelete(record.uniId)" danger v-privilege="'extend:uni:remove'" type="link">
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
import { uniApi } from '../../../api/extend/uni-api';
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
    title: '应用名称',
    dataIndex: 'name',
    ellipsis: true,
    align: 'center',
    width: 200,
  },
  {
    title: '应用图标',
    dataIndex: 'icon',
    ellipsis: true,
    align: 'center',
    width: 200,
  },
  {
    title: '应用信息',
    dataIndex: 'version',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '启用状态',
    dataIndex: 'status',
    align: 'center',
    width: 100,
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 100,
    fixed: 'right',
    align: 'center',
  },
]);

const queryFormState = {
  appId: undefined,
  name: undefined,
  status: undefined,
  type: undefined,
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
    let queryResult = await uniApi.queryUniList(queryForm);
    tableData.value = queryResult.rows;
    total.value = queryResult.total;
  } finally {
    tableLoading.value = false;
  }
}

function onDelete(id) {
  Modal.confirm({
    title: '提示',
    content: '确认删除该数据?',
    onOk() {
      deleteUni(id);
    },
  });
}

// 删除API
async function deleteUni(id) {
  try {
    tableLoading.value = true;
    await uniApi.uniItemDelete(id);
    message.success('删除成功');
    queryList();
  } finally {
    tableLoading.value = false;
  }
}

onMounted(queryList);

</script>