<!--
  * 树形下拉框
-->
<template>
  <a-tree-select :value="props.value" :treeData="treeData"
    :fieldNames="{ label: 'menuName', key: 'menuId', value: 'menuId' }" show-search style="width: 100%"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" placeholder="请选择菜单" allow-clear tree-default-expand-all
    treeNodeFilterProp="menuName" @change="treeSelectChange" />
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { menuApi } from '/@/api/sys/menu-api';

const props = defineProps({
  value: String,
});

let treeData = ref([]);
async function queryMenuTree() {
  let res = await menuApi.queryMenuTree();
  treeData.value = res.data;
}

onMounted(queryMenuTree);

const emit = defineEmits(['update:value']);
function treeSelectChange(e) {
  emit('update:value', e);
}

defineExpose({
  queryMenuTree,
});
</script>
