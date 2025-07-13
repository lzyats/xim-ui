<template>
  <a-row class="smart-table-btn-block">
    <div class="smart-table-operate-block">
    </div>
    <div class="smart-table-setting-block">
      <TableOperator :refresh="searchQuery" :full="false" />
    </div>
  </a-row>
  <div>
    <a-table rowKey="groupNo" :columns="tableColumns" :dataSource="tableData" :pagination="false"
      :loading="tableLoading" size="small" bordered>
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'rowIndex'">
          {{ index + 1 }}
        </template>

        <template v-if="column.dataIndex === 'portrait'">
          <span>
            <a-image :width="60" :height="60" :src="record.portrait" style="border-radius: 10px;" />
          </span>
        </template>

        <template v-if="column.dataIndex === 'groupId'">
          <p>
            <span>群组编号：</span>
            <span>{{ record.groupNo }}</span>
          </p>
          <p>
            <span>群组名称：</span>
            <span>{{ record.groupName }}</span>
          </p>
          <p v-privilege="'chat:group:query'">
            <a @click="viewGroup(record.groupId)" type="link">
              群组详情
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
        :total="total" @change="onPageChange" @showSizeChange="onPageChange" :show-total="(total) => `共${total}条`" />
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
import { GROUP_PAGE_PATH } from '/@/constants/sys/home-const';
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

const messageRef = ref();
function catChatMessage(record) {
  record.userId = props.userId;
  messageRef.value.showDrawer(record);
}
onMounted(searchQuery);

const tableColumns = [
  {
    title: '序号',
    dataIndex: 'rowIndex',
    width: 70,
    align: 'center',
  },
  {
    title: '群组头像',
    dataIndex: 'portrait',
    width: 100,
    align: 'center',
  },
  {
    title: '群组信息',
    dataIndex: 'groupId',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center',
    width: 200,
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

async function queryViewRecord() {
  try {
    tableLoading.value = true;
    const queryResult = await chatUserApi.queryChatGroup(props.userId, queryForm);
    tableData.value = queryResult.rows;
    total.value = queryResult.total;
  } finally {
    tableLoading.value = false;
  }
}

// 点击查询
function searchQuery() {
  queryForm.pageNum = 1;
  queryViewRecord();
}

// 监听分页事件
function onPageChange(currentPage, pageSize) {
  queryForm.pageNum = currentPage;
  queryForm.pageSize = pageSize;
  queryViewRecord();
}

const router = useRouter();
function viewGroup(groupId) {
  router.push(GROUP_PAGE_PATH + groupId);
}

watch(
  queryForm,
  () => {
    queryViewRecord();
  },
  { deep: true }
);

</script>

<style scoped>
.smart-query-table-page {
  margin-top: 10px;
  text-align: right;
}
</style>