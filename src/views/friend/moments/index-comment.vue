<template>
  <a-row class="smart-table-btn-block">
    <div class="smart-table-operate-block">
    </div>
    <div class="smart-table-setting-block">
      <TableOperator :refresh="searchQuery" :full="false" />
    </div>
  </a-row>
  <a-card size="small" :bordered="false" :hoverable="true">

<!---------- 表格操作行 begin ----------->
<a-row class="smart-table-btn-block">
  <div class="smart-table-operate-block">
    <a-button type="primary" v-privilege="'friend:comments:add'" @click="add()">增加评论</a-button>
    <!-- 引入子组件并监听 reloadList 事件 -->
    <AddModel ref="addModel" @reloadList="refreshParentPage" />
  </div>
  <div class="smart-table-setting-block">
    <TableOperator v-model="columns" :tableId="TABLE_ID.FC" :refresh="queryViewRecord" />
  </div>
</a-row>
<!---------- 表格操作行 end ----------->

<!---------- 表格 begin ----------->
<a-table size="small" :dataSource="tableData" :columns="columns" rowKey="commentId" bordered :loading="tableLoading"
  :pagination="false">
  <template #bodyCell="{ record, column, index }">
    <template v-if="column.dataIndex === 'rowIndex'">
      <span>
        {{ index + 1 }}
      </span>
    </template>

    <template v-if="column.dataIndex === 'commentId'">
      <p>
        <span>评论ID：</span>
        <span>{{ record.commentId }}</span>
      </p>
      <p>
        <span>关联动态ID：</span>
        <span>{{ record.momentId }}</span>
      </p>
      <p>
        <span>评论用户ID：</span>
        <span>{{ record.userId }}</span>
      </p>
    </template>

    <template v-if="column.dataIndex === 'replyTo'">
      <p>
        <span>回复的评论ID：</span>
        <span>{{ record.replyTo || '无' }}</span>
      </p>
      <p>
        <span>创建时间：</span>
        <span>{{ record.createTime }}</span>
      </p>
    </template>

    <template v-if="column.dataIndex === 'content'">
      <p>
        <span>评论内容：</span>
        <span>{{ record.content }}</span>
      </p>
    </template>

    <template v-if="column.dataIndex === 'isDeleted'">
      <p>
        <span>逻辑删除标记：</span>
        <a-tag v-if="record.isDeleted === 0" color="success">未删除</a-tag>
        <a-tag v-if="record.isDeleted === 1" color="error">已删除</a-tag>
      </p>
    </template>

    <template v-if="column.dataIndex === 'action'">
      <div class="smart-table-operate">
        <a-button @click="deleteComment(record.commentId)" v-privilege="'friend:comments:remove'" type="link">
          删除评论
        </a-button>
      </div>
    </template>
  </template>
</a-table>
<!---------- 表格 end ----------->

<div class="smart-query-table-page">
  <a-pagination showSizeChanger showQuickJumper show-less-items :pageSizeOptions="PAGE_SIZE_OPTIONS"
    :defaultPageSize="queryForm.pageSize" v-model:current="queryForm.pageNum" v-model:pageSize="queryForm.pageSize"
    :total="total" @change="queryViewRecord" @showSizeChange="queryViewRecord" :show-total="(total) => `共${total}条`" />
</div>
</a-card>

</template>
<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { friendCommentApi } from '/@/api/friend/friend-comments-api';
import { PAGE_SIZE_OPTIONS } from '/@/constants/common-const';
import { TableOperator, TABLE_ID } from '/@/components/table-operator';
import { message, Modal } from 'ant-design-vue';
import AddModel from '/@/views/friend/comments/index-add.vue';

const props = defineProps({
  momentId: {
    type: [Number, String],
  },
});

const columns = ref([
  {
    title: '序号',
    dataIndex: 'rowIndex',
    width: 60,
    align: 'center',
  },
  {
    title: '评论基本信息',
    dataIndex: 'commentId',
  },
  {
    title: '回复与时间信息',
    dataIndex: 'replyTo',
  },
  {
    title: '评论内容',
    dataIndex: 'content',
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 80,
    align: 'center',
    fixed: 'right',
  },
]);

const defaultQueryForm = {
  pageNum: 1,
  pageSize: 10,
};

const queryForm = reactive({ ...defaultQueryForm });

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
    const queryResult = await friendCommentApi.queryListall(props.momentId);
    tableData.value = queryResult.rows;
    total.value = queryResult.total;
  } finally {
    tableLoading.value = false;
  }
}

// 初始化时加载数据
onMounted(() => {
  console.log(props.momentId);
  queryViewRecord();
});

// 新建
const addModel = ref(null);
function add() {
  addModel.value.showDrawer(props.momentId);
}

// 刷新评论列表的方法
function refreshParentPage() {
  // 在这里执行刷新评论列表的逻辑
  // 例如，重新获取评论数据
  queryViewRecord(props.momentId);
}

// 删除评论操作
function deleteComment(commentId) {
  Modal.confirm({
    title: '提示',
    content: '确认删除当前评论吗?',
    okText: '确认',
    cancelText: '取消',
    async onOk() {
      try {
        await friendCommentApi.delete(commentId);
        message.success('删除成功');
        queryViewRecord(props.momentID);
      } catch (error) {
        message.error('删除失败，请重试');
        console.error('删除评论失败', error);
      }
    },
  });
}

watch(
  queryForm,
  () => {
    queryViewRecord();
  },
  { deep: true }
);
</script>