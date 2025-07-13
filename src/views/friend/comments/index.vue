<template>
  <!---------- 查询表单form begin ----------->
  <a-form class="smart-query-form">
    <a-row class="smart-query-form-row">

      <a-form-item label="评论ID" class="smart-query-form-item">
        <a-input style="width: 150px" v-model:value="queryForm.commentId" placeholder="评论ID" :allowClear=true />
      </a-form-item>

      <a-form-item label="关联动态ID" class="smart-query-form-item">
        <a-input style="width: 150px" v-model:value="queryForm.momentId" placeholder="关联动态ID" :allowClear=true />
      </a-form-item>

      <a-form-item label="评论用户ID" class="smart-query-form-item">
        <a-input style="width: 150px" v-model:value="queryForm.userId" placeholder="评论用户ID" :allowClear=true />
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
      <a-button-group>

        <a-form-item label="回复的评论ID" class="smart-query-form-item">
          <a-input style="width: 150px" v-model:value="queryForm.replyTo" placeholder="回复的评论ID" :allowClear=true />
        </a-form-item>

        <a-form-item label="逻辑删除标记" class="smart-query-form-item">
          <SmartEnumSelect width="150px" v-model:value="queryForm.isDeleted" enumName="CODE_DELETED_ENUM"
            placeholder="逻辑删除标记" />
        </a-form-item>

      </a-button-group>
    </a-row>

  </a-form>
  <!---------- 查询表单form end ----------->

  <a-card size="small" :bordered="false" :hoverable="true">

    <!---------- 表格操作行 begin ----------->
    <a-row class="smart-table-btn-block">
      <div class="smart-table-operate-block">
        <a-button type="primary" v-privilege="'friend:moments:add'" @click="add">增加评论</a-button>
      </div>
      <div class="smart-table-setting-block">
        <TableOperator v-model="columns" :tableId="TABLE_ID.FC" :refresh="queryList" />
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
            <a-button @click="viewComment(record.commentId)" v-privilege="'friend:comment:query'" type="link">
              评论详情
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

  <AddModel ref="addModel" @reloadList="queryList" />
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { friendCommentApi } from '../../../api/friend/friend-comments-api';
import SmartEnumSelect from '/@/components/framework/smart-enum-select/index.vue';
import { TableOperator, TABLE_ID, PAGE_SIZE_OPTIONS } from '/@/components/table-operator';
import AddModel from './index-add.vue';
import { FRIEND_FRIEND_PAGE_PATH } from '/@/constants/sys/home-const';

// ---------------------------- 表格列 ----------------------------

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
    title: '删除状态',
    dataIndex: 'isDeleted',
    width: 120,
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 80,
    align: 'center',
    fixed: 'right',
  },
]);

// ---------------------------- 查询数据表单和方法 ----------------------------

const queryFormState = {
  commentId: undefined,
  momentId: undefined,
  userId: undefined,
  replyTo: undefined,
  isDeleted: undefined,
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

async function queryList() {
  tableLoading.value = true;
  try {
    let queryResult = await friendCommentApi.queryList(queryForm);
    tableData.value = queryResult.rows;
    total.value = queryResult.total;
  } finally {
    tableLoading.value = false;
  }
}

// 新建、编辑
const addModel = ref();
function add() {
  addModel.value.showDrawer();
}

const router = useRouter();
function viewComment(commentId) {
  router.push(FRIEND_FRIEND_PAGE_PATH+'comments/' + commentId);
}

onMounted(queryList);

</script>