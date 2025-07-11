<template>
  <a-row class="smart-table-btn-block">
    <div class="smart-table-operate-block">
    </div>
    <div class="smart-table-setting-block">
      <TableOperator :refresh="searchQuery" :full="false" />
    </div>
  </a-row>
  <div>
    <a-table rowKey="userId" :columns="tableColumns" :dataSource="tableData" :pagination="false" :loading="tableLoading"
      size="small" bordered>
      <template #bodyCell="{ column, record, index }">
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
            <span>
              用户编号： {{ record.userNo }}
            </span>
          </p>
          <p>
            <span>
              用户昵称： {{ record.nickname }}
            </span>
          </p>
          <p v-privilege="'chat:user:query'">
            <a @click="viewUser(record.userId)">
              用户详情
            </a>
          </p>
        </template>

        <template v-if="column.dataIndex === 'memberType'">
          <a-tag v-if="record.memberType == 'master'" color="error">{{ record.memberTypeLabel }}</a-tag>
          <a-tag v-if="record.memberType == 'manager'" color="success">{{ record.memberTypeLabel }}</a-tag>
          <a-tag v-if="record.memberType == 'normal'" color="warning">{{ record.memberTypeLabel }}</a-tag>
        </template>
        <template v-if="column.dataIndex === 'top'">
          <a-tag v-if="record.top == 'N'" color="success">{{ record.topLabel }}</a-tag>
          <a-tag v-if="record.top == 'Y'" color="error">{{ record.topLabel }}</a-tag>
        </template>
        <template v-if="column.dataIndex === 'disturb'">
          <a-tag v-if="record.disturb == 'N'" color="success">{{ record.disturbLabel }}</a-tag>
          <a-tag v-if="record.disturb == 'Y'" color="error">{{ record.disturbLabel }}</a-tag>
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
import { chatGroupApi } from '/@/api/chat/chat-group-api';
import { PAGE_SIZE_OPTIONS } from '/@/constants/common-const';
import { useRouter } from 'vue-router';
import { USER_PAGE_PATH } from '/@/constants/sys/home-const';
import { TableOperator, TABLE_ID } from '/@/components/table-operator';

const props = defineProps({
  groupId: {
    type: [Number, String],
  },
});

const defaultQueryForm = {
  pageNum: 1,
  pageSize: 10,
};

const queryForm = reactive({ ...defaultQueryForm });

defineExpose({
  searchQuery,
});

const tableColumns = [
  {
    title: '序号',
    dataIndex: 'rowIndex',
    width: 60,
    align: 'center',
  },
  {
    title: '成员头像',
    dataIndex: 'portrait',
    width: 100,
    align: 'center',
  },
  {
    title: '成员信息',
    dataIndex: 'userId',
  },
  {
    title: '成员头衔',
    dataIndex: 'memberType',
    align: 'center',
  },
  {
    title: '是否置顶',
    dataIndex: 'top',
    align: 'center',
  },
  {
    title: '是否静默',
    dataIndex: 'disturb',
    align: 'center',
  },
  {
    title: '成员来源',
    dataIndex: 'source',
    align: 'center',
  },
  {
    title: '加群时间',
    dataIndex: 'createTime',
    align: 'center',
  },
];

const tableData = ref([]);
const total = ref(0);
const tableLoading = ref(false);

async function queryViewRecord() {
  try {
    tableLoading.value = true;
    const queryResult = await chatGroupApi.queryGroupMemberList(props.groupId, queryForm);
    tableData.value = queryResult.rows;
    total.value = queryResult.total;
  } catch (err) {
    console.error('Failed to fetch user friend data:', err);
  } finally {
    tableLoading.value = false;
  }
}

// 点击查询
function searchQuery() {
  queryForm.pageNum = 1;
  queryViewRecord();
}

// 在 `queryForm` 发生变化时重新请求数据
watch(
  queryForm,
  () => {
    queryViewRecord();
  },
  { deep: true }
);

const router = useRouter();
function viewUser(userId) {
  router.push(USER_PAGE_PATH + userId);
}

// 初始化时加载数据
onMounted(() => {
  queryViewRecord();
});

// 绑定分页事件处理器
</script>