<template>
  <div>
    <!---------- 表格操作行 begin ----------->
    <a-row class="smart-table-btn-block">
      <div class="smart-table-operate-block">
        <a-button type="primary" @click="openReplyModal">新增</a-button>
      </div>
      <div class="smart-table-setting-block">
        <TableOperator v-model="columns" :tableId="TABLE_ID.BK" :refresh="queryList" />
      </div>
    </a-row>
    <!---------- 表格操作行 end ----------->

    <a-table :columns="tableColumns" :dataSource="tableData" :pagination="false" :loading="tableLoading" size="small"
      bordered>
      <template #bodyCell="{ record, column, index }">
        <template v-if="column.dataIndex === 'rowIndex'">
          {{ index + 1 }}
        </template>
        <template v-if="column.dataIndex === 'replyKey'">
          <a-tag color="pink" v-for="(tag, index) in record.replyKey.split('|')" :key="index">
            {{ tag }}
          </a-tag>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <div class="smart-table-operate">
            <a-button @click="openReplyModal(record)" type="link">修改</a-button>
            <a-button @click="copyEvenn(record.replyId)" type="link">复制</a-button>
            <a-button @click="delSubscribe(record.replyId)" type="link">删除</a-button>
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
  <SubscribeModal ref="subscribeModal" @reloadList="queryList" />
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { robotApi } from '../../../api/extend/robot-api';
import { message, Modal } from 'ant-design-vue';
import SubscribeModal from './index-reply-even-edit.vue';
import { TableOperator, TABLE_ID, PAGE_SIZE_OPTIONS } from '/@/components/table-operator';

const props = defineProps({
  robotId: {
    type: [Number, String],
  },
});

const defaultQueryForm = {
  robotId: props.robotId,
  pageNum: 1,
  pageSize: 10,
};

const queryForm = reactive({ ...defaultQueryForm });

onMounted(queryList);

const tableColumns = [
  {
    title: '序号',
    dataIndex: 'rowIndex',
    width: 80,
    align: 'center',
  },
  {
    title: '关键词',
    dataIndex: 'replyKey',
    width: 100,
    align: 'center',
  },
  {
    title: '内容',
    dataIndex: 'content',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,
    fixed: 'right',
    align: 'center',
  },
];

function delSubscribe(id) {
  Modal.confirm({
    title: '提示',
    content: '确认删除当前数据吗?',
    onOk() {
      delSubscribeReply(id);
    },
  });
}
// 打开更新表单
const subscribeModal = ref();
function openReplyModal(record) {
  record.robotId = props.robotId;
  subscribeModal.value.openUpdateModal(record);
}

async function delSubscribeReply(id) {
  try {
    tableLoading.value = true;
    await robotApi.deleteEven(id);
    message.success('删除成功');
    queryList();
  } finally {
    tableLoading.value = false;
  }
}
function copyEvenn(id) {
  Modal.confirm({
    title: '提示',
    content: '确认复制当前关注回复吗?',
    onOk() {
      copyEven(id);
    },
  });
}

async function copyEven(id) {
  try {
    tableLoading.value = true;
    await robotApi.copyEven(id);
    message.success('复制成功');
    queryList();
  } finally {
    tableLoading.value = false;
  }
}
const tableData = ref([]);
const total = ref(0);
const tableLoading = ref(false);

async function queryList() {
  try {
    tableLoading.value = true;
    const queryResult = await robotApi.evenReplyList(queryForm);
    tableData.value = queryResult.rows;
    total.value = queryResult.total;
  } finally {
    tableLoading.value = false;
  }
}

// 监听分页事件
function onPageChange(currentPage, pageSize) {
  queryForm.pageNum = currentPage;
  queryForm.pageSize = pageSize;
  queryList();
}

// 将分页事件处理器绑定到分页组件
</script>

<style scoped>
.smart-query-table-page {
  margin-top: 10px;
  text-align: right;
}
</style>