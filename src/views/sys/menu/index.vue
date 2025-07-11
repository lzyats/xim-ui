<!--
  * 菜单列表
-->
<template>
  <div>
    <a-card size="small" :bordered="false" :hoverable="true">
      <a-row class="smart-table-btn-block">
        <div class="smart-table-operate-block">
          <a-button v-privilege="'sys:menu:add'" type="primary" @click="showDrawer">
            <template #icon>
              <PlusOutlined />
            </template>
            添加菜单
          </a-button>
        </div>
        <div class="smart-table-setting-block">
          <TableOperator v-model="columns" :tableId="TABLE_ID.AG" :refresh="queryList" />
        </div>
      </a-row>

      <a-table size="small" :defaultExpandAllRows="true" :dataSource="tableData" bordered :columns="columns"
        :loading="tableLoading" rowKey="menuId" :pagination="false">
        <template #bodyCell="{ text, record, column }">
          <template v-if="column.dataIndex === 'menuType'">
            <a-tag :color="menuTypeColorArray[text]">
              {{ $smartEnumPlugin.getDescByValue('MENU_TYPE_ENUM', text) }}
            </a-tag>
          </template>

          <template v-if="column.dataIndex === 'component'">
            <span>{{ record.frameFlag === 'Y' ? record.frameUrl : record.component }}</span>
          </template>

          <template v-if="column.dataIndex === 'icon'">
            <component :is="$antIcons[text]" />
          </template>

          <template v-if="column.dataIndex === 'operate'">
            <div class="smart-table-operate">
              <a-button v-privilege="'sys:menu:edit'" type="link" size="small" @click="showDrawer(record)">编辑</a-button>
              <a-button v-privilege="'sys:menu:remove'" danger type="link" @click="singleDelete(record)">删除</a-button>
              <a-button v-privilege="'sys:menu:copy'" type="link" @click="singleCopy(record)">复制</a-button>
            </div>
          </template>
        </template>
      </a-table>
    </a-card>

    <FormModal ref="formModal" @reloadList="queryList" />
  </div>
</template>
<script setup>
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import _ from 'lodash';
import { createVNode, onMounted, ref } from 'vue';
import FormModal from './index-modal.vue';
import { buildMenuTableTree } from './index-handler';
import { columns } from './index-columns';
import { menuApi } from '/@/api/sys/menu-api';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { TableOperator, TABLE_ID, PAGE_SIZE_OPTIONS } from '/@/components/table-operator';

// ------------------------ 表格渲染 ------------------------
const menuTypeColorArray = ['red', 'blue', 'orange', 'green'];

// ------------------------ table表格数据和查询方法 ------------------------

const tableLoading = ref(false);
const tableData = ref([]);

onMounted(queryList);

async function queryList() {
  try {
    tableLoading.value = true;
    let responseModel = await menuApi.queryList();
    // 递归构造树形结构，并付给 TableTree组件
    tableData.value = buildMenuTableTree(responseModel.data);
  } finally {
    tableLoading.value = false;
  }
}

// -------------- 多选操作 --------------
function singleDelete(record) {
  Modal.confirm({
    title: '确定要删除如下菜单吗?',
    icon: createVNode(ExclamationCircleOutlined),
    content: record.menuName,
    okText: '删除',
    okType: 'danger',
    onOk() {
      requestDelete(record.menuId);
    },
    cancelText: '取消',
    onCancel() { },
  });

  async function requestDelete(menuId) {
    SmartLoading.show();
    await menuApi.deleteMenu(menuId);
    message.success('删除成功');
    queryList();
  }
}

function singleCopy(record) {
  Modal.confirm({
    title: '确定要复制吗?',
    okText: '复制',
    okType: 'danger',
    onOk() {
      requestCopy(record.menuId);
    },
    cancelText: '取消',
    onCancel() { },
  });

  async function requestCopy(menuId) {
    SmartLoading.show();
    await menuApi.copyMenu(menuId);
    message.success('复制成功');
    queryList();
  }
}

// -------------- 添加、修改 右侧抽屉 --------------
const formModal = ref();
function showDrawer(rowData) {
  formModal.value.showDrawer(rowData);
}
</script>
