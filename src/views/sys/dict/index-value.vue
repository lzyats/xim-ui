<template>
  <a-drawer :width="800" :open="visible" :body-style="{ paddingBottom: '80px' }" title="字典值" @close="onClose">
    <a-form class="smart-query-form">
      <a-row class="smart-query-form-row">
        <a-form-item label="名称" class="smart-query-form-item">
          <a-input style="width: 150px" v-model:value="queryForm.dictName" placeholder="请输入名称" :allowClear=true />
        </a-form-item>

        <a-form-item class="smart-query-form-item smart-margin-left10">
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
        </a-form-item>
      </a-row>
    </a-form>

    <a-card size="small" :bordered="false">
      <a-row class="smart-table-btn-block">
        <div class="smart-table-operate-block">
          <a-button @click="addOrUpdateValue" v-privilege="'sys:dict:add'" type="primary" size="small">
            <template #icon>
              <PlusOutlined />
            </template>
            新建
          </a-button>
        </div>
        <div class="smart-table-setting-block"></div>
      </a-row>

      <a-table size="small" :dataSource="tableData" :columns="columns" rowKey="dictId" :pagination="false" bordered>
        <template #bodyCell="{ record, column }">
          <template v-if="column.dataIndex === 'action'">
            <a-button @click="addOrUpdateValue(record)" type="link" v-privilege="'sys:dict:edit'">编辑</a-button>
            <a-button v-privilege="'sys:dict:remove'" danger type="link" @click="singleDelete(record)">删除</a-button>
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
    <FormModal ref="formModal" @reloadList="queryList" />
  </a-drawer>
</template>
<script setup>
import { reactive, ref } from 'vue';
import FormModal from './index-modal.vue';
import { PAGE_SIZE_OPTIONS } from '/@/constants/common-const';
import { dictApi } from '/@/api/sys/dict-api';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { Modal } from 'ant-design-vue';
import { message } from 'ant-design-vue';

// 是否展示抽屉
const visible = ref(false);
const dictType = ref(undefined);

function showModal(dictTypeValue) {
  dictType.value = dictTypeValue;
  visible.value = true;
  queryList();
}

function onClose() {
  visible.value = false;
  dictType.value = undefined;
}

const columns = reactive([
  {
    title: '编码',
    dataIndex: 'dictCode',
    align: 'center',
  },
  {
    title: '名称',
    dataIndex: 'dictName',
    align: 'center',
  },
  {
    title: '排序',
    dataIndex: 'dictSort',
    align: 'center',
    width: 80,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    width: 140,
  },
]);

// ----------------------- 表格 查询 ------------------------

const queryFormState = {
  dictName: '',
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
    queryForm.dictType = dictType.value;
    let responseModel = await dictApi.quertList(queryForm);
    const list = responseModel.rows;
    total.value = responseModel.total;
    tableData.value = list;
  } finally {
    tableLoading.value = false;
  }
}

// ----------------------- 批量 删除 ------------------------


function singleDelete(record) {
  Modal.confirm({
    title: '确定要删除吗?',
    okText: '删除',
    okType: 'danger',
    onOk() {
      requestDelete(record.dictId);
    },
    cancelText: '取消',
    onCancel() { },
  });
}

async function requestDelete(dictId) {
  SmartLoading.show();
  await dictApi.deleteDict(dictId);
  message.success('删除成功');
  queryList();
}

// ----------------------- 弹窗表单操作 ------------------------

const formModal = ref();
function addOrUpdateValue(rowData) {
  formModal.value.showModal(rowData, dictType.value);
}

defineExpose({
  showModal,
});
</script>
