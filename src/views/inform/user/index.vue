<template>
  <a-form class="smart-query-form">
    <a-row class="smart-query-form-row">
      <a-form-item label="举报类型" class="smart-query-form-item">
        <SmartEnumSelect width="150px" v-model:value="queryForm.informType" enumName="CODE_BANNED_TYPE_ENUM"
          placeholder="账号状态" />
      </a-form-item>

      <a-form-item label="处理状态" class="smart-query-form-item">
        <SmartEnumSelect width="150px" v-model:value="queryForm.status" enumName="CODE_STATUS_USER_HANDLE"
          placeholder="封禁状态" />
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
      </div>
      <div class="smart-table-setting-block">
        <TableOperator v-model="columns" :tableId="TABLE_ID.AL" :refresh="queryList" />
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
        <template v-if="column.dataIndex === 'userNo'">
          <p>
            <span>用户编号：</span>
            <span>{{ record.userNo }}</span>
          </p>
          <p>
            <span>用户昵称：</span>
            <span>{{ record.nickname }}</span>
          </p>
          <p v-privilege="'chat:user:query'">
            <a @click="viewUser(record.userId)">
              用户详情
            </a>
          </p>
        </template>
        <template v-if="column.dataIndex === 'targetNo'">
          <p>
            <span>用户编号：</span>
            <span>{{ record.targetNo }}</span>
          </p>
          <p>
            <span>用户昵称：</span>
            <span>{{ record.targetName }}</span>
          </p>
          <p v-privilege="'chat:user:query'">
            <a @click="viewUser(record.targetId)">
              用户详情
            </a>
          </p>
        </template>
        <template v-if="column.dataIndex === 'status'">
          <a-tag v-if="record.status == 'Y'" color="success">{{ record.statusLabel }}</a-tag>
          <a-tag v-if="record.status == 'N'" color="error">{{ record.statusLabel }}</a-tag>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <div class="smart-table-operate" v-privilege="'inform:user:banned'">
            <a-button @click="handView(record)" type="link" v-if="record.status == 'N'">
              处理举报
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
  <InformRef ref="informRef" @reloadList="queryList" />
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import InformRef from './index-modal.vue';
import { informUserApi } from '/@/api/inform/inform-user-api';
import SmartEnumSelect from '/@/components/framework/smart-enum-select/index.vue';
import { TableOperator, TABLE_ID, PAGE_SIZE_OPTIONS } from '/@/components/table-operator';
import { useRouter } from 'vue-router';
import { USER_PAGE_PATH } from '/@/constants/sys/home-const';
// ---------------------------- 表格列 ----------------------------

const columns = ref([
  {
    title: '序号',
    dataIndex: 'rowIndex',
    width: 60,
    align: 'center',
  },
  {
    title: '举报类型',
    dataIndex: 'informTypeLabel',
    align: 'center',
    width: 200,
  },
  {
    title: '举报人',
    dataIndex: 'userNo',
    width: 200,
  },
  {
    title: '被举报人',
    dataIndex: 'targetNo',
    width: 200,
  },
  {
    title: '处理状态',
    dataIndex: 'status',
    width: 100,
    align: 'center',
  },
  {
    title: '举报日期',
    dataIndex: 'createTime',
    width: 200,
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 80,
    fixed: 'right',
    align: 'center',
  },
]);

const queryFormState = {
  informType: undefined,
  status: 'N',
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

/**
 * 处理
 */
const informRef = ref();
function handView(record) {
  informRef.value.showModal(record);
}

// 查询数据
async function queryList() {
  tableLoading.value = true;
  try {
    let queryResult = await informUserApi.queryList(queryForm);
    tableData.value = queryResult.rows;
    total.value = queryResult.total;
  } finally {
    tableLoading.value = false;
  }
}

const router = useRouter();
function viewUser(userId) {
  router.push(USER_PAGE_PATH + userId);
}

onMounted(queryList);

</script>