<template>
  <a-form class="smart-query-form">
    <a-row class="smart-query-form-row">
      <a-form-item label="群组名称" class="smart-query-form-item">
        <a-input style="width: 150px" v-model:value="queryForm.groupName" placeholder="群组名称" :allowClear=true />
      </a-form-item>

      <a-form-item label="群组编号" class="smart-query-form-item">
        <a-input style="width: 150px" v-model:value="queryForm.groupNo" placeholder="群组编号" :allowClear=true />
      </a-form-item>

      <a-form-item label="封禁状态" class="smart-query-form-item">
        <SmartEnumSelect width="150px" v-model:value="queryForm.banned" enumName="CODE_BANNED_ENUM"
          placeholder="封禁状态" />
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

        <a-form-item label="群组状态" class="smart-query-form-item">
          <SmartEnumSelect width="150px" v-model:value="queryForm.status" enumName="CODE_STATUS_ENUM"
            placeholder="群组状态" />
        </a-form-item>

      </a-button-group>
    </a-row>
  </a-form>
  <!---------- 查询表单form end ----------->

  <a-card size="small" :bordered="false" :hoverable="true">

    <!---------- 表格操作行 begin ----------->
    <a-row class="smart-table-btn-block">
      <div class="smart-table-operate-block">
      </div>
      <div class="smart-table-setting-block">
        <TableOperator v-model="columns" :tableId="TABLE_ID.AK" :refresh="queryList" />
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

        <template v-if="column.dataIndex === 'groupId'">
          <p>
            <span>群组编号：</span>
            <span>{{ record.groupNo }}</span>
          </p>
          <p>
            <span>群组名称：</span>
            <span>{{ record.groupName }}</span>
          </p>
          <p>
            <a @click="catChatMessage(record)" v-privilege="'chat:group:msg'" type="link">
              聊天记录
            </a>
          </p>
        </template>
        <template v-if="column.dataIndex === 'memberCount'">
          <p>
            <span>{{ record.memberCount }}/{{ record.levelCount }}</span>
          </p>
        </template>
        <template v-if="column.dataIndex === 'banned'">
          <p>
            <span>群组状态：</span>
            <a-tag v-if="record.status == 'Y'" color="success">{{ record.statusLabel }}</a-tag>
            <a-tag v-if="record.status == 'N'" color="error">{{ record.statusLabel }}</a-tag>
          </p>
          <p>
            <span>封禁状态：</span>
            <a-tag v-if="record.banned == 'Y'" color="error">{{ record.bannedLabel }}</a-tag>
            <a-tag v-if="record.banned == 'N'" color="success">{{ record.bannedLabel }}</a-tag>
          </p>
        </template>

        <template v-if="column.dataIndex === 'portrait'">
          <span>
            <a-image :width="60" :height="60" :src="record.portrait" style="border-radius: 10px;" />
          </span>
        </template>

        <template v-if="column.dataIndex === 'action'">
          <div class="smart-table-operate">
            <a-button @click="view(record.groupId)" v-privilege="'chat:group:query'" type="link">
              群组详情
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

  <ChatMessage ref="chatMessageRef" />

</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import ChatMessage from './index-message.vue';
import { useRouter } from 'vue-router';
import { chatGroupApi } from '/@/api/chat/chat-group-api';
import SmartEnumSelect from '/@/components/framework/smart-enum-select/index.vue';
import { TableOperator, TABLE_ID, PAGE_SIZE_OPTIONS } from '/@/components/table-operator';
import { GROUP_PAGE_PATH } from '/@/constants/sys/home-const';
// ---------------------------- 表格列 ----------------------------

const columns = ref([
  {
    title: '序号',
    dataIndex: 'rowIndex',
    width: 60,
    align: 'center',
  },
  {
    title: '群组头像',
    dataIndex: 'portrait',
    ellipsis: true,
    width: 80,
    align: 'center',
  },
  {
    title: '群组信息',
    dataIndex: 'groupId',
    ellipsis: true,
  },
  {
    title: '群组状态',
    dataIndex: 'banned',
    align: 'center',
    width: 200,
  },
  {
    title: '成员数量',
    dataIndex: 'memberCount',
    ellipsis: true,
    width: 200,
    align: 'center',
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
    width: 80,
    fixed: 'right',
    align: 'center',
  },
]);

const queryFormState = {
  groupName: undefined,
  groupNo: undefined,
  status: 'Y',
  banned: undefined,
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
// 收起
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

const chatMessageRef = ref();
function catChatMessage(record) {
  chatMessageRef.value.showDrawer(record);
}

// 查询数据
async function queryList() {
  tableLoading.value = true;
  try {
    let queryResult = await chatGroupApi.queryList(queryForm);
    tableData.value = queryResult.rows;
    total.value = queryResult.total;
  } finally {
    tableLoading.value = false;
  }
}

// 详情集合
const router = useRouter();
function view(groupId) {
  router.push(GROUP_PAGE_PATH + groupId);
}

onMounted(queryList);

</script>