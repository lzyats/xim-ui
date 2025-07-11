<template>
  <a-card title="群组配置">
    <a-form class="ant-advanced-search-form" :model="updateForm" autocomplete="off" ref="updateFormRef">
      <a-row :gutter="24">
        <a-col :span="10">
          <a-form-item label="群成员数" name="count" :rules="[{ required: true, message: '默认群成员数不能为空' }]"
            help="仅限[ 新建群聊 ] / [ 到期群聊 ]生效，最大9999人">
            <a-input-number style="width: 100%;" v-model:value="updateForm.count" :min="1" :max="9999" addon-after="人"
              :maxlength="20"></a-input-number>
          </a-form-item>
          <a-form-item label="群名搜索" name="search" :rules="[{ required: true }]" help="开启后，支持使用群名称搜索群聊，建议关闭">
            <a-radio-group v-model:value="updateForm.search">
              <a-radio value="Y">开启</a-radio>
              <a-radio value="N">关闭</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <a-form-item>
            <a-button type="primary" v-privilege="'operate:group:edit'" @click="confirmUpdate">保存</a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
  <!---------- 查询表单form end ----------->

  <a-card size="small" :bordered="false" :hoverable="true" style="margin-top: 15px;">

    <!---------- 表格操作行 begin ----------->
    <a-row class="smart-table-btn-block">
      <div class="smart-table-operate-block">
      </div>
      <div class="smart-table-setting-block">
        <TableOperator v-model="columns" :tableId="TABLE_ID.BG" :refresh="queryList" />
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
        <template v-if="column.dataIndex === 'status'">
          <a-tag v-if="record.status == 'Y'" color="success">启用</a-tag>
          <a-tag v-if="record.status == 'N'" color="error">禁用</a-tag>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <div class="smart-table-operate" v-privilege="'operate:group:edit'">
            <a-button @click="openUpdateModal(record)" type="link">修改</a-button>
          </div>
        </template>
      </template>
    </a-table>
  </a-card>
  <!-- 表单操作 -->
  <FormModal ref="formModal" @reloadList="queryList" />
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import FormModal from './index-modal.vue';
import { message } from 'ant-design-vue';
import { groupApi } from '/@/api/operate/group-api';
import { SmartLoading } from '/@/components/framework/smart-loading/index.js';
import { TableOperator, TABLE_ID, PAGE_SIZE_OPTIONS } from '/@/components/table-operator';

// ---------------------------- 表格列 ----------------------------

const columns = ref([
  {
    title: '群组等级',
    dataIndex: 'groupLevel',
    ellipsis: true,
    width: 80,
    align: 'center',
  },
  {
    title: '群员人数',
    dataIndex: 'levelCount',
    ellipsis: true,
    width: 120,
    align: 'center',
  },
  {
    title: '价格',
    dataIndex: 'levelPrice',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '启用状态',
    dataIndex: 'status',
    ellipsis: true,
    width: 100,
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

const groupConfigformState = {
  count: undefined,
};
const updateFormRef = ref();
// 查询表单form
const updateForm = reactive({ ...groupConfigformState });
// 表格加载loading
const tableLoading = ref(false);
// 表格数据
const tableData = ref([]);

const formModal = ref();

// 打开更新表单
function openUpdateModal(record) {
  formModal.value.openUpdateModal(record);
}
async function queryList() {
  tableLoading.value = true;
  try {
    let queryResult = await groupApi.queryGroupList();
    tableData.value = queryResult.data;
    let groupConfig = await groupApi.groupGetConfig();
    Object.assign(updateForm, groupConfig.data);
  } finally {
    tableLoading.value = false;
  }
}

// 确认更新
async function confirmUpdate() {
  updateFormRef.value.validate().then(async () => {
    SmartLoading.show();
    await groupApi.editGroupConfig(updateForm);
    message.success('修改成功');
    queryList();
  });
}

onMounted(queryList);

</script>