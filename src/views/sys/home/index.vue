<!--
  * 首页
-->
<template>
  <!--  顶部用户信息-->
  <a-row>
    <HomeHeader />
  </a-row>
  <!--下方左右布局-->
  <a-row :gutter="24">
    <!--左侧-->
    <a-col :span="12">
      <p>
        <Visit />
      </p>
    </a-col>
    <!--右侧-->
    <a-col :span="12">
      <p>
        <Trend />
      </p>

    </a-col>
    <!--左侧-->
    <a-col :span="12">
      <p>
        <UserVersion />
      </p>

    </a-col>
    <!--右侧-->
    <a-col :span="12">
      <p>
        <UserDevice />
      </p>
    </a-col>
  </a-row>
</template>
<script setup>
import HomeHeader from './home-header.vue';
import Visit from './components/echarts/visit-home.vue';
import Trend from './components/echarts/trend-home.vue';
import UserVersion from './components/echarts/user-version.vue';
import UserDevice from './components/echarts/user-device.vue';

</script>
<style lang="less" scoped>
@import './index.less';
</style>
