<template>
  <a-card title="商店审核">
    <a-form class="ant-advanced-search-form" :model="updateForm" autocomplete="off" ref="updateFormRef">
      <a-row :gutter="24">
        <a-col :span="10">
          <a-form-item label="审核手机" name="phone" :rules="[{ required: true }]" help="商店审核手机号码，慎重修改">
            <a-input v-model:value="updateForm.phone" :maxlength="11">
            </a-input>
          </a-form-item>
          <a-form-item label="审核开关" name="audit" :rules="[{ required: true }]" help="开启后，审核手机号码可以免验证码登录">
            <a-radio-group v-model:value="updateForm.audit">
              <a-radio value="Y">开启</a-radio>
              <a-radio value="N">关闭</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <a-form-item>
            <a-button type="primary" v-privilege="'operate:version:edit'" @click="confirmUpdate">保存</a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
  <!---------- 查询表单form end ----------->

  <a-card size="small" style="margin-top: 15px;">

    <!---------- 表格操作行 begin ----------->
    <a-row class="smart-table-btn-block">
      <div class="smart-table-operate-block">
      </div>
      <div class="smart-table-setting-block">
        <TableOperator v-model="columns" :tableId="TABLE_ID.BE" :refresh="queryList" />
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
        <template v-if="column.dataIndex === 'action'">
          <div class="smart-table-operate" v-privilege="'operate:version:edit'">
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
import { message, Modal } from 'ant-design-vue';
import { versionApi } from '/@/api/operate/version-api';
import { SmartLoading } from '/@/components/framework/smart-loading/index.js';
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
    title: '设备类型',
    dataIndex: 'deviceLabel',
    ellipsis: true,
    width: 100,
    align: 'center',
  },
  {
    title: '最新版本',
    dataIndex: 'version',
    ellipsis: true,
    width: 100,
    align: 'center',
  },
  {
    title: '下载地址',
    dataIndex: 'url',
    ellipsis: true,
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 100,
    fixed: 'right',
    align: 'center',
  },
]);
const configState = {
  phone: undefined,
  version: undefined,
};
const updateFormRef = ref();
// 查询表单form
const updateForm = reactive({ ...configState });
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
    let queryResult = await versionApi.queryVersionList();
    tableData.value = queryResult.data;
    let versionConfig = await versionApi.versionGetConfig();
    Object.assign(updateForm, versionConfig.data);
  } finally {
    tableLoading.value = false;
  }
}

// 确认更新
async function confirmUpdate() {
  updateFormRef.value.validate().then(async () => {
    SmartLoading.show();
    await versionApi.editVersionConfig(updateForm);
    message.success('修改成功');
    queryList();
  });
}

onMounted(queryList);

</script>