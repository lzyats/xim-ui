<template>
  <a-card size="small" :bordered="false" :hoverable="true">
    <a-row class="smart-table-btn-block">
      <div class="smart-table-operate-block">
        <a-button v-privilege="'friend:comments:add'" type="primary" @click="openUpdateModal({momentId:props.momentId})">
          <template #icon>
            <PlusOutlined />
          </template>
          新增
        </a-button>
      </div>
      <div class="smart-table-setting-block">
        <TableOperator v-model="columns" :tableId="TABLE_ID.BC" :refresh="queryList" />
      </div>
    </a-row>

    <a-row :gutter="[16, 16]">
      <a-col  v-for="(record) in tableData" :key="record.fileId">
        <a-card :bordered="false" :hoverable="true" size="small">
          <template #cover>
            <a-image :width="150" :height="150" :src="record.url" style="border-radius: 10px;" />
          </template>
          <a-card-meta>
            <template #description>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div class="smart-table-operate">
                  <a-button @click="openUpdateModal(record)" v-privilege="'operate:portrait:edit'"
                    type="link">修改</a-button>
                  <a-button @click="onDelete(record.mediaId)" danger v-privilege="'operate:portrait:remove'"
                    type="link">删除</a-button>
                </div>
              </div>
            </template>
          </a-card-meta>
        </a-card>
      </a-col>
    </a-row>

    <div class="smart-query-table-page">
      <a-pagination showSizeChanger showQuickJumper show-less-items :pageSizeOptions="PAGE_SIZE_OPTIONS"
        :defaultPageSize="queryForm.pageSize" v-model:current="queryForm.pageNum" v-model:pageSize="queryForm.pageSize"
        :total="total" @change="queryList" @showSizeChange="queryList" :show-total="(total) => `共${total}条`" />
    </div>
  </a-card>

  <FormModal ref="formModal" @reloadList="queryList" />
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import { friendMediasApi } from '/@/api/friend/friend_medias-api';
import FormModal from './index-modal.vue';
import { message, Modal } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { TableOperator, TABLE_ID, PAGE_SIZE_OPTIONS } from '/@/components/table-operator';


// ---------------------------- 表格列 ----------------------------

const columns = ref([
  {
    title: '序号',
    dataIndex: 'rowIndex',
    width: 80,
    align: 'center',
  },

  {
    title: '信息图片',
    dataIndex: 'url',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 120,
    fixed: 'right',
    align: 'center',
  },
]);

const props = defineProps({
  momentId: {
    type: [Number, String],
  },
  userId: {
    type: [Number, String],
  },
});

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

const momentId = ref();

// 初始化时加载数据
onMounted(() => {
  queryList();
});
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

const formModal = ref();

// 打开更新表单
function openUpdateModal(record) {
  formModal.value.openUpdateModal(record);
}

async function queryList() {
  tableLoading.value = true;
  try {
    let queryResult = await friendMediasApi.queryListall(props.momentId);
    tableData.value = queryResult.rows;
    total.value = queryResult.total;
  } finally {
    tableLoading.value = false;
  }
}

function onDelete(id) {
  Modal.confirm({
    title: '提示',
    content: '确认删除该图像?',
    onOk() {
      deleteHelp(id);
    },
  });
}

// 删除API
async function deleteHelp(id) {
  try {
    tableLoading.value = true;
    await friendMediasApi.delete(id,props.momentId);
    message.success('删除成功');
    queryList();
  } finally {
    tableLoading.value = false;
  }
}




</script>