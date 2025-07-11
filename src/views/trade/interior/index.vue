<template>
  <a-form class="smart-query-form">
    <a-row class="smart-query-form-row">

      <a-form-item label="发送用户编号" class="smart-query-form-item">
        <a-input style="width: 150px" v-model:value="queryForm.userNo" placeholder="发送用户编号" :allowClear=true />
      </a-form-item>
      <a-form-item label="发送手机号码" class="smart-query-form-item">
        <a-input style="width: 150px" v-model:value="queryForm.phone" placeholder="发送手机号码" :allowClear=true />
      </a-form-item>

      <a-form-item label="群组编号" class="smart-query-form-item">
        <a-input style="width: 150px" v-model:value="queryForm.groupNo" placeholder="群组编号" :allowClear=true />
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

        <a-button class="smart-margin-left20" @click="moreQueryConditionFlag = !moreQueryConditionFlag">
          <template #icon>
            <MoreOutlined />
          </template>
          {{ moreQueryConditionFlag ? '收起' : '展开' }}
        </a-button>

      </a-form-item>
    </a-row>

    <a-row class="smart-query-form-row" v-show="moreQueryConditionFlag">
      <a-form-item label="接收用户编号" class="smart-query-form-item">
        <a-input style="width: 150px" v-model:value="queryForm.receiveNo" placeholder="接收用户编号" :allowClear=true />
      </a-form-item>

      <a-form-item label="接收手机号码" class="smart-query-form-item">
        <a-input style="width: 150px" v-model:value="queryForm.receivePhone" :maxlength="11" placeholder="接收手机号码"
          :allowClear=true />
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
        <TableOperator v-model="columns" :tableId="TABLE_ID.BM" :refresh="queryList" />
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
        <template v-if="column.dataIndex === 'groupName'">
          <p>
            <span>群组名称：</span>
            <span>{{ record.groupName }}</span>
          </p>
          <p>
            <span>群组编号：</span>
            <span>{{ record.groupNo }}</span>
          </p>
          <p v-privilege="'chat:group:query'">
            <a @click="viewGroup(record.groupId)">
              群组详情
            </a>
          </p>
        </template>
        <template v-if="column.dataIndex === 'nickname'">
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
        <template v-if="column.dataIndex === 'receiveName'">
          <p>
            <span>用户编号：</span>
            <span>{{ record.receiveNo }}</span>
          </p>
          <p>
            <span>用户昵称：</span>
            <span>{{ record.receiveName }}</span>
          </p>
          <p>
            <span>手机号码：</span>
            <span>{{ record.receivePhone }}</span>
          </p>
          <p v-privilege="'chat:user:query'">
            <a @click="viewUser(record.receiveId)">
              用户详情
            </a>
          </p>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <div class="smart-table-operate">
            <a-button @click="handView(record.tradeId)" type="link">查看详情</a-button>
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

  <AssignRef ref="assignRef" @reloadList="queryList" />

</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import AssignRef from './index-modal.vue';
import { tradeApi } from '/@/api/trade/trade-api';
import { TableOperator, TABLE_ID, PAGE_SIZE_OPTIONS } from '/@/components/table-operator';
import { useRouter } from 'vue-router';
import { GROUP_PAGE_PATH, USER_PAGE_PATH } from '/@/constants/sys/home-const';

// ---------------------------- 表格列 ----------------------------

const columns = ref([
  {
    title: '序号',
    dataIndex: 'rowIndex',
    width: 60,
    align: 'center',
  },
  {
    title: '群组信息',
    dataIndex: 'groupName',
    ellipsis: true,
  },
  {
    title: '发送用户',
    dataIndex: 'nickname',
    ellipsis: true,
  },
  {
    title: '接收用户',
    dataIndex: 'receiveName',
    ellipsis: true,
  },
  {
    title: '转账金额',
    dataIndex: 'amount',
    ellipsis: true,
    width: 100,
    align: 'center',
  },
  {
    title: '转账日期',
    dataIndex: 'createTime',
    width: 200,
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
  chatNo: undefined,
  phone: undefined,
  receiveNo: undefined,
  receivePhone: undefined,
  groupNo: undefined,
  tradeType: '1011',
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
const moreQueryConditionFlag = ref(false);
// 重置查询条件
function resetQuery() {
  let pageSize = queryForm.pageSize;
  Object.assign(queryForm, queryFormState);
  queryForm.pageSize = pageSize;
  queryForm.tradeType = '1005';
  queryList();
}

// 重置分页条件
function searchQuery() {
  queryForm.pageNum = queryFormState.pageNum;
  queryList();
}

/**
 * 操作
 */
const assignRef = ref();
function handView(tradeId) {
  assignRef.value.showModal(tradeId);
}

// 查询数据
async function queryList() {
  tableLoading.value = true;
  try {
    let queryResult = await tradeApi.queryList(queryForm);
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

function viewGroup(groupId) {
  router.push(GROUP_PAGE_PATH + groupId);
}

onMounted(queryList);

</script>