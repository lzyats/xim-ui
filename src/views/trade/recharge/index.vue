<template>
  <a-form class="smart-query-form">
    <a-row class="smart-query-form-row">

      <a-form-item label="用户编号" class="smart-query-form-item">
        <a-input style="width: 150px" v-model:value="queryForm.userNo" placeholder="用户编号" :allowClear=true />
      </a-form-item>

      <a-form-item label="手机号码" class="smart-query-form-item">
        <a-input style="width: 150px" v-model:value="queryForm.phone" :maxlength="11" placeholder="手机号码"
          :allowClear=true />
      </a-form-item>

      <a-form-item label="充值类型" class="smart-query-form-item">
        <a-select style="width: 150px" v-model:value="queryForm.payType" placeholder="请选择" :allowClear=true>
          <a-select-option value="0">系统充值</a-select-option>
          <a-select-option value="1">支付宝</a-select-option>
          <a-select-option value="2">微信</a-select-option>
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
        <a-button class="smart-margin-left20" @click="moreQueryConditionFlag = !moreQueryConditionFlag">
          <template #icon>
            <MoreOutlined />
          </template>
          {{ moreQueryConditionFlag ? '收起' : '展开' }}
        </a-button>
      </a-form-item>
    </a-row>
    <a-row class="smart-query-form-row" v-show="moreQueryConditionFlag">
      <a-form-item label="交易单号" class="smart-query-form-item">
        <a-input style="width: 150px" v-model:value="queryForm.tradeNo" placeholder="交易单号" :allowClear=true />
      </a-form-item>
      <a-form-item label="商户单号" class="smart-query-form-item">
        <a-input style="width: 150px" v-model:value="queryForm.orderNo" placeholder="商户单号" :allowClear=true />
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
        <TableOperator v-model="columns" :tableId="TABLE_ID.AQ" :refresh="queryList" />
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
            <a @click="viewUser(record.userId)" type="link">
              用户详情
            </a>
          </p>
        </template>

        <template v-if="column.dataIndex === 'orderNo'">
          <p>
            <span>商户单号：</span>
            <span>{{ record.orderNo }}</span>
          </p>
          <p>
            <span>交易单号：</span>
            <span>{{ record.tradeNo }}</span>
          </p>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <div class="smart-table-operate">
            <a-button @click="handView(record.tradeId)" type="link">
              查看详情
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

  <RechargeModal ref="rechargeModal" @reloadList="queryList" />

</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import RechargeModal from './index-modal.vue';
import { tradeApi } from '/@/api/trade/trade-api';
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
    title: '用户信息',
    dataIndex: 'nickname',
    ellipsis: true,
  },
  {
    title: '充值金额',
    dataIndex: 'amount',
    ellipsis: true,
    width: 100,
    align: 'center',
  },
  {
    title: '支付方式',
    dataIndex: 'payTypeLabel',
    width: 100,
    align: 'center',
  },
  {
    title: '订单编号',
    dataIndex: 'orderNo',
    width: 400,
  },
  {
    title: '操作日期',
    dataIndex: 'createTime',
    width: 200,
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
  chatNo: undefined,
  phone: undefined,
  payType: undefined,
  orderNo: undefined,
  tradeNo: undefined,
  tradeType: '1001',
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
  queryForm.tradeType = '1001';
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
const rechargeModal = ref();
function handView(tradeId) {
  rechargeModal.value.showModal(tradeId);
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

onMounted(queryList);

</script>