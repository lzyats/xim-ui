<template>
  <a-layout class="admin-layout" style="min-height: 100%">
    <SmartNotification />
    <!-- 侧边菜单 side-menu -->
    <a-layout-sider class="side-menu" :width="sideMenuWidth" :collapsed="collapsed" :theme="theme">
      <!-- 左侧菜单 -->
      <SideMenu :collapsed="collapsed" />
    </a-layout-sider>

    <!--中间内容，一共三部分：1、顶部;2、中间内容区域;3、底部（一般是公司版权信息）;-->
    <a-layout id="smartAdminMain" :style="`height: ${windowHeight}px`" class="admin-layout-main">
      <!-- 顶部头部信息 -->
      <a-layout-header class="layout-header">
        <a-row class="layout-header-user" justify="space-between">
          <a-col class="layout-header-left">
            <span class="collapsed-button">
              <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" />
              <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
            </span>
            <a-tooltip placement="bottom">
              <template #title>首页</template>
              <span class="home-button" @click="goHome">
                <home-outlined class="trigger" />
              </span>
            </a-tooltip>
            <span class="location-breadcrumb">
              <MenuLocationBreadcrumb />
            </span>
          </a-col>
          <!---用戶操作区域-->
          <a-col class="layout-header-right">
            <HeaderUserSpace />
          </a-col>
        </a-row>
        <PageTag />
      </a-layout-header>

      <!--中间内容-->
      <a-layout-content id="smartAdminLayoutContent" class="admin-layout-content">
        <!-- iframe页面 -->
        <IframeIndex v-for="item in iframePages" v-show="route.name == item.name" :key="item.name" :name="item.name"
          :url="item.meta.frameUrl" />
        <!--非iframe页面-->
        <div v-show="!iframeFlag">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" :key="route.name" v-if="!route.meta.ignore" />
            </keep-alive>
            <component :is="Component" :key="route.name" v-if="route.meta.ignore" />
          </router-view>
        </div>
      </a-layout-content>

      <!-- footer 版权公司信息 -->
      <a-layout-footer class="layout-footer" v-show="footerFlag">
        <smart-footer />
      </a-layout-footer>

      <!--- 回到顶部 -->
      <a-back-top :target="backTopTarget" :visibilityHeight="80" />
    </a-layout>
  </a-layout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useAppConfigStore } from '/@/store/config';
import SmartNotification from '/@/components/framework/smart-notification/index.vue';
import HeaderUserSpace from './components/header/index.vue';
import MenuLocationBreadcrumb from './components/menu-breadcrumb/index.vue';
import PageTag from './components/page-tag/index.vue';
import SideMenu from './components/side-menu/index.vue';
import SmartFooter from './components/smart-footer/index.vue';
import { smartKeepAlive } from './components/smart-keep-alive';
import IframeIndex from '/@/components/framework/iframe/iframe-index.vue';
import watermark from '/@/lib/smart-watermark';
import { useUserStore } from '/@/store/user';
import { useRouter } from 'vue-router';
import { HOME_PAGE_NAME } from '/@/constants/sys/home-const';

const windowHeight = ref(window.innerHeight);
//菜单宽度
const sideMenuWidth = computed(() => useAppConfigStore().$state.sideMenuWidth);
//主题颜色
const theme = computed(() => useAppConfigStore().$state.sideMenuTheme);
//是否显示标签页
const pageTagFlag = computed(() => useAppConfigStore().$state.pageTagFlag);
// 是否显示页脚
const footerFlag = computed(() => useAppConfigStore().$state.footerFlag);
// 是否显示水印
const watermarkFlag = computed(() => useAppConfigStore().$state.watermarkFlag);
// 多余高度
const dueHeight = computed(() => {
  let due = 40;
  if (useAppConfigStore().$state.pageTagFlag) {
    due = due + 40;
  }
  if (useAppConfigStore().$state.footerFlag) {
    due = due + 40;
  }
  return due;
});
//是否隐藏菜单
const collapsed = ref(false);

//页面初始化的时候加载水印
onMounted(() => {
  if (watermarkFlag.value) {
    watermark.set('smartAdminLayoutContent', useUserStore().username);
  } else {
    watermark.clear();
  }
});

watch(
  () => watermarkFlag.value,
  (newValue) => {
    if (newValue) {
      watermark.set('smartAdminLayoutContent', useUserStore().username);
    } else {
      watermark.clear();
    }
  }
);

//回到顶部
const backTopTarget = () => {
  return document.getElementById('smartAdminMain');
};

const router = useRouter();
function goHome() {
  router.push({ name: HOME_PAGE_NAME });
}

window.addEventListener('resize', function () {
  windowHeight.value = window.innerHeight;
});

// ----------------------- keep-alive相关 -----------------------
let { route, iframeFlag, iframePages } = smartKeepAlive();
</script>

<style lang="less" scoped>
:deep(.ant-layout-header) {
  height: auto;
}

:deep(.layout-header) {
  height: auto;
}

.layout-header {
  background: #fff;
  padding: 0;
  z-index: 21;
}

.layout-header-user {
  height: @header-user-height;
  border-bottom: 1px solid #f6f6f6;
}

.layout-header-left {
  display: flex;
  height: @header-user-height;

  .collapsed-button {
    margin-left: 10px;
    line-height: @header-user-height;
  }

  .home-button {
    margin-left: 15px;
    cursor: pointer;
    padding: 0 5px;
    line-height: @header-user-height;
  }

  .home-button:hover {
    background-color: #efefef;
  }

  .location-breadcrumb {
    margin-left: 15px;
    line-height: @header-user-height;
  }
}

.layout-header-right {
  display: flex;
  height: @header-user-height;
}

.layout-container {
  height: calc(100vh - @header-height);
  overflow-x: hidden;
}

.admin-layout {
  .side-menu {
    height: 100vh;
    overflow-x: hidden;
    overflow-y: scroll;

    &.fixed-side {
      position: fixed;
      height: 100vh;
      left: 0;
      top: 0;
    }
  }

  .side-menu::-webkit-scrollbar {
    width: 4px;
  }

  .side-menu::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.2);
  }

  .side-menu::-webkit-scrollbar-track {
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }

  .help-doc-sider {
    flex: 0 !important;
    min-width: 100px;
    height: 100vh;
    max-width: 100px;
    width: auto !important;

    &.fixed-side {
      position: fixed;
      height: 100vh;
      right: 0;
      top: 0;
    }
  }

  .virtual-side {
    transition: all 0.2s;
  }

  .virtual-header {
    transition: all 0.2s;
    opacity: 0;

    &.fixed-tabs.multi-page:not(.fixed-header) {
      height: 0;
    }
  }

  .admin-layout-main {
    overflow-y: hidden;
    overflow-x: hidden;
  }

  .admin-layout-content {
    background-color: inherit;
    min-height: auto;
    position: relative;
    overflow-x: hidden;
    padding: 10px 10px 0px 10px;
    height: calc(100% - v-bind(dueHeight) px);
  }
}

.layout-footer {
  position: relative;
  padding: 7px 0px;
  display: flex;
  justify-content: center;
}
</style>
