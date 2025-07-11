<template>
  <a-row class="smart-table-btn-block">
    <div class="smart-table-operate-block">
    </div>
    <div class="smart-table-setting-block">
      <TableOperator :refresh="searchQuery" :full="false" />
    </div>
  </a-row>
  <div>
    <a-table rowKey="userNo" :columns="tableColumns" :dataSource="tableData" :pagination="false" :loading="tableLoading"
      size="small" bordered>
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'rowIndex'">
          {{ index + 1 }}
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
            <span>用户手机：</span>
            <span>{{ record.phone }}</span>
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
        <template v-if="column.dataIndex === 'status'">
          <p>
            <span>实名状态：</span>
            <a-tag v-if="record.auth == '0'" color="magenta">
              {{ record.authLabel }}
            </a-tag>
            <a-tag v-if="record.auth == '1'" color="warning">
              {{ record.authLabel }}
            </a-tag>
            <a-tag v-if="record.auth == '2'" color="success">
              {{ record.authLabel }}
            </a-tag>
            <a-tag v-if="record.auth == '3'" color="error">
              {{ record.authLabel }}
            </a-tag>
          </p>
          <p>
            <span>帐号状态：</span>
            <a-tag v-if="record.status == 'Y'" color="success">{{ record.statusLabel }}</a-tag>
            <a-tag v-if="record.status == 'N'" color="error">{{ record.statusLabel }}</a-tag>
          </p>
          <p>
            <span>封禁状态：</span>
            <a-tag v-if="record.banned == 'Y'" color="error">{{ record.bannedLabel }}</a-tag>
            <a-tag v-if="record.banned == 'N'" color="success">{{ record.bannedLabel }}</a-tag>
          </p>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <div class="smart-table-operate" v-privilege="'chat:user:query'">
            <a-button @click="viewUser(record.userId)" type="link">用户详情</a-button>
          </div>
        </template>

      </template>
    </a-table>
    <div class="smart-query-table-page">
      <a-pagination showSizeChanger showQuickJumper show-less-items :pageSizeOptions="PAGE_SIZE_OPTIONS"
        :defaultPageSize="queryForm.pageSize" v-model:current="queryForm.pageNum" v-model:pageSize="queryForm.pageSize"
        :total="total" @change="queryViewRecord" @showSizeChange="queryViewRecord"
        :show-total="(total) => `共${total}条`" />
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { chatUserApi } from '/@/api/chat/chat-user-api';
import { PAGE_SIZE_OPTIONS } from '/@/constants/common-const';
import { useRouter } from 'vue-router';
import { USER_PAGE_PATH } from '/@/constants/sys/home-const';
import { TableOperator, TABLE_ID } from '/@/components/table-operator';

const props = defineProps({
  userId: {
    type: [Number, String],
  },
});

const defaultQueryForm = {
  pageNum: 1,
  pageSize: 10,
};

const queryForm = reactive({ ...defaultQueryForm });

const tableColumns = [
  {
    title: '序号',
    dataIndex: 'rowIndex',
    width: 60,
    align: 'center',
  },
  {
    title: '用户头像',
    dataIndex: 'portrait',
    width: 100,
    align: 'center',
  },
  {
    title: '用户信息',
    dataIndex: 'userId',
  },
  {
    title: '登录信息',
    dataIndex: 'onLine',
  },
  {
    title: '用户状态',
    dataIndex: 'status',
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 120,
    fixed: 'right',
    align: 'center',
  },
];

const tableData = ref([]);
const total = ref(0);
const tableLoading = ref(false);

// 点击查询
function searchQuery() {
  queryForm.pageNum = 1;
  queryViewRecord();
}

async function queryViewRecord() {
  try {
    tableLoading.value = true;
    const queryResult = await chatUserApi.queryIp(props.userId, queryForm);
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

// 初始化时加载数据
onMounted(() => {
  queryViewRecord();
});

watch(
  queryForm,
  () => {
    queryViewRecord();
  },
  { deep: true }
);
</script>