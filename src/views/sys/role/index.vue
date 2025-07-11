<template>
  <div>
    <a-form class="smart-query-form">
      <a-row class="smart-query-form-row">
        <a-form-item label="角色名称" class="smart-query-form-item">
          <a-input style="width: 150px" v-model:value="queryForm.roleName" placeholder="请输入角色名称" :maxlength="30"
            :allowClear=true />
        </a-form-item>
        <a-form-item label="角色状态" class="smart-query-form-item">
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
          <a-button v-privilege="'sys:role:add'" type="primary" @click="openUpdateModal">
            <template #icon>
              <PlusOutlined />
            </template>
            添加角色
          </a-button>
        </div>
        <div class="smart-table-setting-block">
          <TableOperator v-model="columns" :tableId="TABLE_ID.AI" :refresh="queryList" />
        </div>
      </a-row>

      <a-table size="small" :loading="tableLoading" bordered :dataSource="tableData" :columns="columns" rowKey="roleId"
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
              <a-button v-privilege="'sys:role:remove'" danger type="link" @click="singleDelete(record)">删除</a-button>
              <a-button v-privilege="'sys:role:edit'" @click="openUpdateModal(record)" type="link">编辑</a-button>
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
import { roleApi } from '/@/api/sys/role-api';
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
    title: '角色名称',
    dataIndex: 'roleName',
    align: 'center',
  },
  {
    title: '角色字符',
    dataIndex: 'roleKey',
    align: 'center',
  },
  {
    title: '角色状态',
    dataIndex: 'status',
    align: 'center',
  },
  {
    title: '排序',
    dataIndex: 'roleSort',
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
  roleName: '',
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
    let responseModel = await roleApi.queryList(queryForm);
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
      requestDelete(record.roleId);
    },
    cancelText: '取消',
    onCancel() { },
  });
}

async function requestDelete(roleId) {
  SmartLoading.show();
  await roleApi.deleteRole(roleId);
  message.success('删除成功');
  queryList();
}

// ------------------------------------ 表单操作 -------------------------------------
const formModal = ref();

// 打开更新表单
function openUpdateModal(record) {
  formModal.value.openUpdateModal(record);
}

</script>
