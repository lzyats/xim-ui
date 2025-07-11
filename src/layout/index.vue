<!--
  *  layout 多种模式
-->
<template>
  <!--左侧菜单 模式-->
  <SideLayout />
</template>
<script setup>
import { computed } from 'vue';
import SideLayout from './side-layout.vue';
import { useAppConfigStore } from '/@/store/config';

const layout = computed(() => useAppConfigStore().$state.layout);
</script>
