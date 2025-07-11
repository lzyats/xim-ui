<template>
  <span>
    <a-tooltip title="全屏" v-if="!fullScreenFlag && full">
      <a-button type="text" @click="fullScreen" size="small">
        <template #icon><fullscreen-outlined /></template>
      </a-button>
    </a-tooltip>
    <a-tooltip title="取消全屏" v-if="fullScreenFlag && full">
      <a-button type="text" @click="fullScreen" size="small">
        <template #icon><fullscreen-exit-outlined /></template>
      </a-button>
    </a-tooltip>
    <a-tooltip title="刷新">
      <a-button type="text" @click="props.refresh" size="small">
        <template #icon><redo-outlined /></template>
      </a-button>
    </a-tooltip>
    <a-tooltip title="列设置" v-if="props.tableId">
      <a-button type="text" @click="showModal" size="small">
        <template #icon><setting-outlined /></template>
      </a-button>
    </a-tooltip>
    <SmartTableColumnModal ref="smartTableColumnModal" @change="updateColumn" />
  </span>
</template>

<script setup>
import _ from 'lodash';
import { columnApi } from '/@/api/sys/column-api';
import { onMounted, ref, watch } from 'vue';
import SmartTableColumnModal from './index-modal.vue';
import { message } from 'ant-design-vue';
import { mergeColumn } from './index-merge';

const props = defineProps({
  // 表格列数组
  modelValue: {
    type: Array,
    default: new Array(),
  },
  // 刷新表格函数
  refresh: {
    type: Function,
    required: true,
  },
  // 表格id
  tableId: {
    type: Number,
  },
  // 全屏
  full: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['update:modelValue']);

// 原始表格列数据（复制一份最原始的columns集合，以供后续各个地方使用）
let originalColumn = _.cloneDeep(props.modelValue);

onMounted(buildUserTableColumns);

//构建用户的数据列
async function buildUserTableColumns() {
  if (!props.tableId) {
    return;
  }

  let userTableColumnArray = [];
  let res = await columnApi.getColumns(props.tableId);
  if (res.data) {
    userTableColumnArray = JSON.parse(res.data);
  }
  updateColumn(userTableColumnArray);
}

// ----------------- 全屏 -------------------
const fullScreenFlag = ref(false);
function fullScreen() {
  if (fullScreenFlag.value) {
    //取消全屏
    exitFullscreen(document.querySelector('#smartAdminLayoutContent'));
    fullScreenFlag.value = false;
  } else {
    //全屏
    launchFullScreen(document.querySelector('#smartAdminLayoutContent'));
    fullScreenFlag.value = true;
  }
}

//判断各种浏览器 -全屏
function launchFullScreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else {
    message.error('当前浏览器不支持部分全屏！');
  }
}
//判断各种浏览器 -退出全屏
function exitFullscreen(element) {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

// ----------------- 弹窗 修改表格列 -------------------

const smartTableColumnModal = ref();
function showModal() {
  smartTableColumnModal.value.show(originalColumn, props.tableId);
}

// 将弹窗修改的列数据，赋值给原表格 列数组
function updateColumn(changeColumnArray) {
  //合并列
  const newColumns = mergeColumn(_.cloneDeep(originalColumn), changeColumnArray);
  emit(
    'update:modelValue',
    newColumns.filter((e) => e.showFlag)
  );
}

// ========= 定义 watch 监听 ===============
watch(
  () => props.tableId,
  (e) => {
    if (e) {
      originalColumn = _.cloneDeep(props.modelValue);
    }
  },
  { immediate: true }
);

</script>
