<template>
  <div>
    <a-form class="smart-query-form">
      <a-row class="smart-query-form-row">
        <a-form-item label="用户账号" class="smart-query-form-item">
          <a-input style="width: 150px" v-model:value="queryForm.username" placeholder="请输入用户账号" :maxlength="30"
            :allowClear=true />
        </a-form-item>

        <a-form-item label="用户角色" class="smart-query-form-item">
          <a-select style="width: 150px" v-model:value="queryForm.roleId" placeholder="请选择用户角色" :allowClear=true>
            <a-select-option v-for="item in roleList" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="用户状态" class="smart-query-form-item">
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
          <a-button v-privilege="'sys:user:add'" type="primary" @click="openUpdateModal">
            <template #icon>
              <PlusOutlined />
            </template>
            添加用户
          </a-button>
        </div>
        <div class="smart-table-setting-block">
          <TableOperator v-model="columns" :tableId="TABLE_ID.AH" :refresh="queryList" />
        </div>
      </a-row>

      <a-table size="small" :loading="tableLoading" bordered :dataSource="tableData" :columns="columns" rowKey="userId"
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
              <a-button v-privilege="'sys:user:edit'" danger type="link" @click="openPassModal(record)">重置</a-button>
              <a-button v-privilege="'sys:user:remove'" danger type="link" @click="singleDelete(record)">删除</a-button>
              <a-button v-privilege="'sys:user:edit'" @click="openUpdateModal(record)" type="link">编辑</a-button>
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

    <!-- 表单操作 -->
    <FormPass ref="passModal" @reloadList="queryList" />

  </div>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import { userApi } from '/@/api/sys/user-api';
import { TableOperator, TABLE_ID, PAGE_SIZE_OPTIONS } from '/@/components/table-operator';
import FormModal from './index-modal.vue';
import FormPass from './index-pass.vue';
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
    title: '用户账号',
    dataIndex: 'username',
    align: 'center',
  },
  {
    title: '用户昵称',
    dataIndex: 'nickname',
    align: 'center',
  },
  {
    title: '用户角色',
    dataIndex: 'roleName',
    align: 'center',
  },
  {
    title: '用户备注',
    dataIndex: 'remark',
    align: 'center',
  },
  {
    title: '用户状态',
    dataIndex: 'status',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: 150,
    align: 'center',
  },
]);

// ---------------- 查询数据 -----------------------

const queryFormState = {
  username: '',
  roleId: undefined,
  status: undefined,
  pageNum: 1,
  pageSize: 10,
};

const roleList = ref([]);

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
    queryRoleList();
    let responseModel = await userApi.queryList(queryForm);
    const list = responseModel.rows;
    total.value = responseModel.total;
    tableData.value = list;
  } finally {
    tableLoading.value = false;
  }
}

async function queryRoleList() {
  let responseModel = await userApi.queryRoleList();
  roleList.value = responseModel.data;
}

onMounted(queryList);

// ---------------- 批量 删除 -----------------

function singleDelete(record) {
  Modal.confirm({
    title: '确定要删除吗?',
    okText: '删除',
    okType: 'danger',
    onOk() {
      requestDelete(record.userId);
    },
    cancelText: '取消',
    onCancel() { },
  });
}

async function requestDelete(userId) {
  SmartLoading.show();
  await userApi.deleteUser(userId);
  message.success('删除成功');
  queryList();
}

// ------------------------------------ 表单操作 -------------------------------------
const formModal = ref();

// 打开更新表单
function openUpdateModal(record) {
  formModal.value.openUpdateModal(record);
}


const passModal = ref();
// 打开更新表单
function openPassModal(record) {
  passModal.value.openUpdateModal(record);
}
</script>
