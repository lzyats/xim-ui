<!--
  * 面包屑
-->
<template>
  <a-breadcrumb separator=">" v-if="breadCrumbFlag" class="breadcrumb">
    <a-breadcrumb-item v-for="(item, index) in parentMenuList" :key="index">{{ item.title }}</a-breadcrumb-item>
    <a-breadcrumb-item>{{ currentRoute.meta.title }}</a-breadcrumb-item>
  </a-breadcrumb>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { useAppConfigStore } from '/@/store/config';

// 是否显示面包屑
const breadCrumbFlag = computed(() => useAppConfigStore().$state.breadCrumbFlag);

let currentRoute = useRoute();
//根据路由监听面包屑
const parentMenuList = computed(() => {
  let currentName = currentRoute.name;
  if (!currentName || typeof currentName !== 'string') {
    return [];
  }
});
</script>
<style scoped lang="less">
.breadcrumb {
  line-height: @page-tag-height;
}
</style>