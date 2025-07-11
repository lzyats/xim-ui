<template>
  <a-form class="smart-query-form">
    <a-row class="smart-query-form-row">
      <a-form-item label="反馈内容" class="smart-query-form-item">
        <a-input style="width: 150px" v-model:value="queryForm.content" placeholder="反馈内容" :allowClear=true />
      </a-form-item>
      <a-form-item label="是否处理" class="smart-query-form-item">
        <a-select style="width: 120px" v-model:value="queryForm.status" placeholder="请选择" :allowClear=true>
          <a-select-option value="Y">已处理</a-select-option>
          <a-select-option value="N">待处理</a-select-option>
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
        <TableOperator v-model="columns" :tableId="TABLE_ID.BB" :refresh="queryList" />
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
          <p v-privilege="'chat:user:query'">
            <a @click="viewUser(record.userId)">
              用户详情
            </a>
          </p>
        </template>

        <template v-if="column.dataIndex === 'portrait'">
          <span>
            <a-image :width="60" :height="60" :src="record.portrait" style="border-radius: 10px;" />
          </span>
        </template>

        <template v-if="column.dataIndex === 'status'">
          <p>
            <a-tag v-if="record.status == 'Y'" color="success">{{ record.statusLabel }}</a-tag>
            <a-tag v-if="record.status == 'N'" color="error">{{ record.statusLabel }}</a-tag>
          </p>
        </template>

        <template v-if="column.dataIndex === 'action'">
          <div class="smart-table-operate">
            <a-button @click="handView(record.id)" v-privilege="'operate:feedback:query'" type="link">详情</a-button>
            <a-button @click="onDelete(record.id)" danger v-privilege="'operate:feedback:remove'" type="link">
              删除
            </a-button>
            <a-button @click="onEdit(record.id)" v-privilege="'operate:feedback:edit'" type="link">处理</a-button>
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
  <FeedbackDetails ref="feedbackDetails" @reloadList="queryList" />
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import FeedbackDetails from './index-details.vue';
import { message, Modal } from 'ant-design-vue';
import { feedbackApi } from '/@/api/operate/feedback-api';
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
    dataIndex: 'nickname',
    ellipsis: true,
  },
  {
    title: '版本',
    dataIndex: 'version',
    ellipsis: true,
    width: 80,
    align: 'center',
  },
  {
    title: '反馈内容',
    dataIndex: 'content',
    width: 300,
    align: 'center',
  },
  {
    title: '反馈状态',
    dataIndex: 'status',
    width: 100,
    align: 'center',
  },
  {
    title: '反馈日期',
    dataIndex: 'createTime',
    ellipsis: true,
    width: 200,
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,
    fixed: 'right',
    align: 'center',
  },
]);

const queryFormState = {
  content: undefined,
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
const moreQueryConditionFlag = ref(false);
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
 * 操作
 */
const feedbackDetails = ref();
function handView(id) {
  feedbackDetails.value.showModal(id);
}

async function queryList() {
  tableLoading.value = true;
  try {
    let queryResult = await feedbackApi.queryFeedbackList(queryForm);
    tableData.value = queryResult.rows;
    total.value = queryResult.total;
  } finally {
    tableLoading.value = false;
  }
}

function onDelete(id) {
  Modal.confirm({
    title: '提示',
    content: '确认删除该建议反馈?',
    onOk() {
      deleteFeedback(id);
    },
  });
}

// 删除API
async function deleteFeedback(id) {
  try {
    tableLoading.value = true;
    await feedbackApi.feedbackDelete(id);
    message.success('删除成功');
    queryList();
  } finally {
    tableLoading.value = false;
  }
}

function onEdit(id) {
  Modal.confirm({
    title: '提示',
    content: '确认处理该建议反馈?',
    async onOk() {
      try {
        tableLoading.value = true;
        await feedbackApi.feedbackEdit(id);
        message.success('处理成功');
        queryList();
      } finally {
        tableLoading.value = false;
      }
    },
  });
}

const router = useRouter();
function viewUser(userId) {
  router.push(USER_PAGE_PATH + userId);
}

onMounted(queryList);

</script>