<template>

  <a-card size="small" :bordered="false" :hoverable="true">

    <!---------- 表格操作行 begin ----------->
    <a-row class="smart-table-btn-block">
      <div class="smart-table-operate-block">
        <a-button type="primary" @click="searchQuery">刷新</a-button>
      </div>
      <div class="smart-table-setting-block">
        <TableOperator v-model="columns" :tableId="TABLE_ID.BJ" :refresh="queryList" />
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
        <template v-if="column.dataIndex === 'portrait'">
          <span>
            <a-image :width="60" :height="60" :src="record.portrait" style="border-radius: 10px;" />
          </span>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <div class="smart-table-operate">
            <a-button @click="openUpdateModal(record)" v-privilege="'extend:robot:edit'" type="link">
              修改
            </a-button>
            <a-button @click="onResetRobot(record.robotId)" danger v-privilege="'extend:robot:edit'" type="link">
              秘钥
            </a-button>
            <span v-if="record.robotId != 10001">
              <br />
              <br />
              <a-button @click="openMenuModal(record)" v-privilege="'extend:robot:edit'" v-if="record.robotId != 10001"
                type="link">
                菜单
              </a-button>
              <a-button @click="openReplyModal(record)" v-privilege="'extend:robot:reply'"
                v-if="record.robotId != 10001" type="link">
                回复
              </a-button>
            </span>
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
  <!-- 表单操作 -->
  <FormModal ref="formModal" @reloadList="queryList" />
  <MenuModal ref="menuModal" @reloadList="queryList" />
  <ReplyModal ref="replyModal" @reloadList="queryList" />

</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import FormModal from './index-modal.vue';
import MenuModal from './index-menu.vue';
import ReplyModal from './index-reply.vue';
import { message, Modal } from 'ant-design-vue';
import { robotApi } from '../../../api/extend/robot-api';
import { TableOperator, TABLE_ID, PAGE_SIZE_OPTIONS } from '/@/components/table-operator';

// ---------------------------- 表格列 ----------------------------

const columns = ref([
  {
    title: '序号',
    dataIndex: 'rowIndex',
    width: 30,
    align: 'center',
  },
  {
    title: '头像',
    dataIndex: 'portrait',
    ellipsis: true,
    align: 'center',
    width: 50,
  },
  {
    title: '名称',
    dataIndex: 'nickname',
    align: 'center',
    width: 100,
  },
  {
    title: 'ID',
    dataIndex: 'robotId',
    align: 'center',
    width: 40,
  },
  {
    title: '秘钥',
    dataIndex: 'secret',
    align: 'center',
    width: 120,
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 60,
    fixed: 'right',
    align: 'center',
  },
]);

const queryFormState = {
  status: undefined,
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
// 重置分页条件
function searchQuery() {
  queryForm.pageNum = queryFormState.pageNum;
  queryList();
}

const formModal = ref();
const menuModal = ref();//菜单
const replyModal = ref();//回复

// 打开更新表单
function openReplyModal(record) {
  replyModal.value.openUpdateModal(record);
}

// 打开更新表单
function openMenuModal(record) {
  menuModal.value.openUpdateModal(record);
}

// 打开更新表单
function openUpdateModal(record) {
  formModal.value.openUpdateModal(record);
}

async function queryList() {
  tableLoading.value = true;
  try {
    let queryResult = await robotApi.queryList(queryForm);
    tableData.value = queryResult.rows;
    total.value = queryResult.total;
  } finally {
    tableLoading.value = false;
  }
}

function onResetRobot(id) {
  Modal.confirm({
    title: '提示',
    content: '确认重置秘钥?',
    onOk() {
      resetRobot(id);
    },
  });
}

// 重置API
async function resetRobot(id) {
  try {
    tableLoading.value = true;
    await robotApi.resetRobot(id);
    message.success('重置成功');
    queryList();
  } finally {
    tableLoading.value = false;
  }
}

onMounted(queryList);

</script>