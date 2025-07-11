<template>
  <DefaultTab v-if="pageTagStyle === PAGE_TAG_ENUM.DEFAULT.value" />
  <AntdTab v-if="pageTagStyle === PAGE_TAG_ENUM.ANTD.value" />
</template>

<script setup>
import { computed } from 'vue';
import { useAppConfigStore } from '/@/store/config';
import DefaultTab from './components/default-tab.vue';
import AntdTab from './components/antd-tab.vue';
import { PAGE_TAG_ENUM } from '/@/constants/layout-const.js';

const pageTagStyle = computed(() => useAppConfigStore().$state.pageTagStyle);
</script>
