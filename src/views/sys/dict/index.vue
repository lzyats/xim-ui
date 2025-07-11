<!--
  * 数据 字典
-->
<template>
  <a-form class="smart-query-form">
    <a-row class="smart-query-form-row">
      <a-form-item label="名称" class="smart-query-form-item">
        <a-input style="width: 150px" v-model:value="queryForm.dictName" placeholder="请输入名称" :allowClear=true />
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
        <a-button @click="addOrUpdateKey" v-privilege="'sys:dict:add'" type="primary">
          <template #icon>
            <PlusOutlined />
          </template>
          新建
        </a-button>
      </div>
      <div class="smart-table-setting-block">
        <TableOperator v-model="columns" :tableId="TABLE_ID.AF" :refresh="queryList" />
      </div>
    </a-row>

    <a-table size="small" :dataSource="tableData" :columns="columns" :loading="tableLoading" rowKey="dictId"
      :pagination="false" bordered>
      <template #bodyCell="{ record, column, index }">
        <template v-if="column.dataIndex === 'dictCode'">
          <a @click="showValueList(record.dictCode)">{{ record.dictCode }}</a>
        </template>

        <template v-if="column.dataIndex === 'rowIndex'">
          {{ index + 1 }}
        </template>

        <template v-else-if="column.dataIndex === 'action'">
          <div class="smart-table-operate">
            <a-button v-privilege="'sys:dict:remove'" danger type="link" @click="singleDelete(record)">删除</a-button>
            <a-button @click="addOrUpdateKey(record)" v-privilege="'sys:dict:edit'" type="link">编辑</a-button>
          </div>
        </template>
      </template>
    </a-table>

    <div class="smart-query-table-page">
      <a-pagination showSizeChanger showQuickJumper show-less-items :pageSizeOptions="PAGE_SIZE_OPTIONS"
        :defaultPageSize="queryForm.pageSize" v-model:current="queryForm.pageNum" v-model:pageSize="queryForm.pageSize"
        :total="total" @change="queryList" @showSizeChange="queryList" :show-total="(total) => `共${total}条`" />
    </div>

    <FormModal ref="formModal" @reloadList="queryList" />
    <!-- 值列表 -->
    <ValueModal ref="valueModal" />
  </a-card>
</template>
<script setup>
import FormModal from './index-modal.vue';
import ValueModal from './index-value.vue';
import { reactive, ref, onMounted } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { dictApi } from '/@/api/sys/dict-api';
import { TableOperator, TABLE_ID, PAGE_SIZE_OPTIONS } from '/@/components/table-operator';

const columns = ref([
  {
    title: '序号',
    dataIndex: 'rowIndex',
    width: 80,
    align: 'center',
  },
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
    width: 100,
  },
]);

// ---------------- 查询数据 -----------------

const queryFormState = {
  dictName: '',
  pageNum: 1,
  pageSize: 10,
};

const queryForm = reactive({ ...queryFormState });
const tableLoading = ref(false);
const tableData = ref([]);
const total = ref(0);
const formModal = ref();
const valueModal = ref();

// 显示操作记录弹窗
function showValueList(dictType) {
  valueModal.value.showModal(dictType);
}

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
    let responseModel = await dictApi.quertList(queryForm);
    tableData.value = responseModel.rows;
    total.value = responseModel.total;
  } finally {
    tableLoading.value = false;
  }
}

// ---------------- 批量 删除 -----------------

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

// ---------------- 添加/更新 -----------------

function addOrUpdateKey(rowData) {
  formModal.value.showModal(rowData);
}

onMounted(queryList);
</script>
