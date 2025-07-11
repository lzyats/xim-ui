<!--
  * 头部一整行
-->
<template>
  <a-space :size="10">
    <div class="setting">
      <!---帮助中心--->
      <a-button type="text" @click="getHelp">
        帮助中心
      </a-button>
      <!---消息通知--->
      <HeaderMessage ref="headerMessage" />
      <!---设置--->
      <a-button type="text" @click="showSetting" class="operate-icon">
        <template #icon><setting-outlined /></template>
      </a-button>
    </div>
    <!---头像信息--->
    <div class="user-space-item">
      <HeaderUsername />
    </div>
    <HeaderSetting ref="headerSetting" />
  </a-space>
</template>

<script setup>
import HeaderUsername from './header-username.vue';
import HeaderSetting from './header-setting.vue';
import HeaderMessage from './header-message.vue';
import { ref } from 'vue';
import { theme } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { HELP_PAGE_PATH } from '/@/constants/sys/home-const';

// 设置
const headerSetting = ref();
function showSetting() {
  headerSetting.value.show();
}

// 帮助中心
const router = useRouter();
function getHelp() {
  router.push(HELP_PAGE_PATH);
}

//消息通知
const headerMessage = ref();

const { useToken } = theme;
const { token } = useToken();
</script>