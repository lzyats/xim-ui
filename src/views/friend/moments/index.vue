<template>
  <!---------- 查询表单form begin ----------->
  <a-form class="smart-query-form">
    <a-row class="smart-query-form-row">
      <a-form-item label="动态ID" class="smart-query-form-item">
        <a-input style="width: 150px" v-model:value="queryForm.momentId" placeholder="动态ID" :allowClear=true />
      </a-form-item>
      <a-form-item label="发布用户ID" class="smart-query-form-item">
        <a-input style="width: 150px" v-model:value="queryForm.userId" placeholder="发布用户ID" :allowClear=true />
      </a-form-item>
      <a-form-item label="发布者昵称" class="smart-query-form-item">
        <a-input style="width: 150px" v-model:value="queryForm.nickname" placeholder="发布者昵称" :allowClear=true />
      </a-form-item>

      <a-form-item label="逻辑删除标记" class="smart-query-form-item">
        <SmartEnumSelect width="150px" v-model:value="queryForm.isDeleted" enumName="CODE_DELETED_ENUM"
          placeholder="逻辑删除标记" />
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
        <a-button type="primary" v-privilege="'friend:moments:add'" @click="add">增加动态</a-button>
      </div>
      <div class="smart-table-setting-block">
        <TableOperator v-model="columns" :tableId="TABLE_ID.FM" :refresh="queryList" />
      </div>
    </a-row>
    <!---------- 表格操作行 end ----------->

    <!---------- 表格 begin ----------->
    <a-table size="small" :dataSource="tableData" :columns="columns" rowKey="momentId" bordered :loading="tableLoading"
      :pagination="false">
      <template #bodyCell="{ record, column, index }">
        <template v-if="column.dataIndex === 'rowIndex'">
          <span>
            {{ index + 1 }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'momentId'">
          <p>
            <span>动态ID：</span>
            <span>{{ record.momentId }}</span>
          </p>
          <p>
            <span>发布用户ID：</span>
            <span>{{ record.userId }}</span>
          </p>
          
        </template>
        <template v-if="column.dataIndex === 'userNo'">

          <p>
            <span>昵称：</span>
            <span>{{ record.nickname }}</span>
          </p>
          <p>
            <span>用户编号：</span>
            <span>{{ record.userNo }}</span>
          </p>
        </template>
        <template v-if="column.dataIndex === 'content'">
          <p>
            <span>{{ record.content }}</span>
          </p>
        </template>
        <template v-if="column.dataIndex === 'location'">
          <p>
            <span>位置信息：</span>
            <span>{{ record.location || '无' }}</span>
          </p>
        </template>
        <template v-if="column.dataIndex === 'visibility'">
          <p>
            <a-tag v-if="record.visibility === 0" color="success">完全公开</a-tag>
            <a-tag v-if="record.visibility === 1" color="error">好友可见</a-tag>
            <a-tag v-if="record.visibility === 2" color="warning">自己可见</a-tag>
            <a-tag v-if="record.visibility === 3" color="warning">部分可见</a-tag>
            <a-tag v-if="record.visibility === 4" color="warning">部分不可见</a-tag>
          </p>
        </template>
        <template v-if="column.dataIndex === 'createTime'" >
          <p>
            <span>{{ record.createTime }}</span>
          </p>
        </template>
        <template v-if="column.dataIndex === 'updateTime'">
          <p>
            <span>{{ record.updateTime}}</span>
          </p>
        </template>
        <template v-if="column.dataIndex === 'isDeleted'">
          <p>
            <a-tag v-if="record.isDeleted === 0" color="success">未删除</a-tag>
            <a-tag v-if="record.isDeleted === 1" color="error">已删除</a-tag>
          </p>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <div class="smart-table-operate">
            <a-button @click="viewMoment(record.momentId,record.userId)" v-privilege="'friend:moments:query'" type="link">
              信息详情
            </a-button>
            <a-button @click="deleteComment(record.momentId)" v-privilege="'friend:moments:query'" type="link">
              删除信息
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
import dayjs, { Dayjs } from 'dayjs';
import { friendMomentsApi } from '../../../api/friend/friend-moments-api';
import SmartEnumSelect from '/@/components/framework/smart-enum-select/index.vue';
import { TableOperator, TABLE_ID, PAGE_SIZE_OPTIONS } from '/@/components/table-operator';
import AddModel from './index-add.vue';
import { FRIEND_FRIEND_PAGE_PATH } from '/@/constants/sys/home-const';
import { message, Modal } from 'ant-design-vue';

// ---------------------------- 表格列 ----------------------------
const columns = ref([
  {
    title: '序号',
    dataIndex: 'rowIndex',
    width: 60,
    align: 'center',
  },
  {
    title: '动态基本信息',
    dataIndex: 'momentId',
  },
  {
    title: '用户信息',
    dataIndex: 'userNo',
  },
  {
    title: '文字内容',
    dataIndex: 'content',
  },
  {
    title: '位置信息',
    dataIndex: 'location',
  },
  {
    title: '可见性',
    dataIndex: 'visibility',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
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
// 时间格式化函数
function formatTime(time) {
  if (!time) return '-';
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
}
// ---------------------------- 查询数据表单和方法 ----------------------------
const queryFormState = {
  momentId: undefined,
  userId: undefined,
  visibility: undefined,
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

// 删除信息操作
function deleteComment(momentId) {
  Modal.confirm({
    title: '提示',
    content: '确认删除当前朋友圈吗?',
    okText: '确认',
    cancelText: '取消',
    async onOk() {
      try {
        await friendMomentsApi.deletedMoments(momentId);
        message.success('删除成功');
        queryList();
      } catch (error) {
        message.error('删除失败，请重试');
        console.error('删除评论失败', error);
      }
    },
  });
}

async function queryList() {
  tableLoading.value = true;
  try {
    let queryResult = await friendMomentsApi.queryList(queryForm);
    console.log('查询结果:', queryResult.rows); // 打印查询结果，检查 create_time 字段
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
function viewMoment(momentId,userId) {
  router.push(FRIEND_FRIEND_PAGE_PATH + 'moments/' + momentId+'/'+userId);
}
onMounted(queryList);
</script>