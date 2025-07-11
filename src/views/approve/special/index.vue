<template>

  <a-card size="small" :bordered="false" :hoverable="true">

    <!---------- 表格操作行 begin ----------->
    <a-row class="smart-table-btn-block">
      <div class="smart-table-operate-block">
        <a-button type="primary" @click="searchQuery">刷新</a-button>
      </div>
      <div class="smart-table-setting-block">
        <TableOperator v-model="columns" :tableId="TABLE_ID.BO" :refresh="queryList" />
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

        <template v-if="column.dataIndex === 'portrait'">
          <span>
            <a-image :width="60" :height="60" :src="record.portrait" style="border-radius: 10px;" />
          </span>
        </template>

        <template v-if="column.dataIndex === 'userId'">
          <p>
            <span>用户编号：</span>
            <span>{{ record.userNo }}</span>
          </p>
          <p>
            <span>用户昵称：</span>
            <span>{{ record.nickname }}</span>
          </p>
          <p>
            <span>手机号码：</span>
            <span>{{ record.phone }}</span>
          </p>
          <p v-privilege="'chat:user:query'">
            <a @click="viewUser(record.userId)">
              用户详情
            </a>
          </p>
        </template>

        <template v-if="column.dataIndex === 'onLine'">
          <p>
            <span>注册时间：</span>
            <span>{{ record.createTime }}</span>
          </p>
          <p>
            <span>最近登录：</span>
            <span>{{ record.onLine }}</span>
          </p>
          <p>
            <span>登录地址：</span>
            <span>{{ record.ipAddr }}</span>
          </p>
        </template>

        <template v-if="column.dataIndex === 'address'">
          <p>
            <span>注册时间：</span>
            <span>{{ record.ipAddr }}</span>
          </p>
          <p>
            <span>最近登录：</span>
            <span>{{ record.onLine }}</span>
          </p>
          <p v-privilege="'chat:user:query'">
            <a @click="viewUser(record.userId)" type="link">
              用户详情
            </a>
          </p>
        </template>

        <template v-if="column.dataIndex === 'action'">
          <div class="smart-table-operate" v-privilege="'approve:special:edit'">
            <a-button @click="handView(record)" type="link">
              异常详情
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
  <SpecialRef ref="specialRef" @reloadList="queryList" />
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import SpecialRef from './index-modal.vue';
import { approveSpecialApi } from '/@/api/approve/approve-special-api';
import { TableOperator, TABLE_ID, PAGE_SIZE_OPTIONS } from '/@/components/table-operator';
import { useRouter } from 'vue-router';
import { USER_PAGE_PATH } from '/@/constants/sys/home-const';

// ---------------------------- 表格列 ----------------------------

const columns = ref([
  {
    title: '序号',
    dataIndex: 'rowIndex',
    width: 80,
    align: 'center',
  },
  {
    title: '用户头像',
    dataIndex: 'portrait',
    ellipsis: true,
    width: 100,
    align: 'center',
  },
  {
    title: '用户信息',
    dataIndex: 'userId',
    ellipsis: true,
  },
  {
    title: '登录信息',
    dataIndex: 'onLine',
    width: 300,
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

// 重置分页条件
function searchQuery() {
  queryForm.pageNum = queryFormState.pageNum;
  queryList();
}

// 查询数据
async function queryList() {
  tableLoading.value = true;
  try {
    let queryResult = await approveSpecialApi.queryList(queryForm);
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
const specialRef = ref();
function handView(record) {
  specialRef.value.showModal(record);
}
onMounted(queryList);

</script>