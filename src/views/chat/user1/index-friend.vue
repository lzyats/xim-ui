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
          <p v-privilege="'chat:user:query'">
            <a @click="viewUser(record.userId)" type="link">
              用户详情
            </a>
          </p>
        </template>

        <template v-if="column.dataIndex === 'action'">
          <div class="smart-table-operate" v-privilege="'chat:user:msg'">
            <a-button @click="catChatMessage(record)" type="link">聊天记录</a-button>
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
  <MessageRef ref="messageRef" />
</template>
<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import MessageRef from './index-message.vue';
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
    title: '用户备注',
    dataIndex: 'remark',
    align: 'center',
  },
  {
    title: '添加时间',
    dataIndex: 'createTime',
    align: 'center',
  },
  {
    title: '好友来源',
    dataIndex: 'source',
    align: 'center',
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
    const queryResult = await chatUserApi.queryFriend(props.userId, queryForm);
    tableData.value = queryResult.rows;
    total.value = queryResult.total;
  } finally {
    tableLoading.value = false;
  }
}

const messageRef = ref();
function catChatMessage(record) {
  record.userId = props.userId;
  messageRef.value.showDrawer(record);
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