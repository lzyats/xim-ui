<template>
  <a-dropdown trigger="click" v-model:open="show">
    <a-button type="text" style="padding: 4px 5px">
      <a-badge :count="messageCount">
        <div style="width: 26px; height: 26px">
          <BellOutlined :style="{ fontSize: '16px' }" />
        </div>
      </a-badge>
    </a-button>
    <template #overlay>
      <a-card class="message-container" :bodyStyle="{ padding: 0 }">
        <a-spin :spinning="loading">
          <a-menu v-for="(item, index) in messages" :key="index">
            <a-badge :count="item.count">
              <a-menu-item :key="item.index" @click="gotoMessage(item.path)"> {{ item.title }} </a-menu-item>
            </a-badge>
          </a-menu>
        </a-spin>
      </a-card>
    </template>
  </a-dropdown>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { BellOutlined } from '@ant-design/icons-vue';
import { theme } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { localRead } from '/@/lib/local-util';
import LocalStorageKeyConst from '/@/constants/local-storage-key-const.js';
import { useUserStore } from '/@/store/user';
import _ from 'lodash';

const { useToken } = theme;
const { token } = useToken();

// WebSocket 连接状态
const connected = ref(false);
const messageCount = ref(0);

const messages = ref([]);

// WebSocket 实例
const websocket = ref(null);

// 拥有的权限
const privilegeList = computed(() => useUserStore().getPointList || []);

// 定义一个变量来控制重连次数
let reconnectAttempts = 0;

// 设置最大重连次数
const maxReconnectAttempts = 99;

// websocket地址
const SOCKET_PATH = import.meta.env.VITE_APP_REQUEST;

// 设置重连间隔时间（单位：毫秒）
const reconnectInterval = 5000;

// 连接到 WebSocket 服务器
function connect(token) {
  websocket.value = new WebSocket(SOCKET_PATH + '/wws?Authorization=' + token);
  websocket.value.onopen = function (event) {
    connected.value = true;
    reconnectAttempts = 0;
    console.log('WebSocket connection success');
  };

  websocket.value.onclose = function (event) {
    connected.value = false;
    console.log('WebSocket connection closed:', event);
    // 如果未达到最大重连次数，则尝试重新连接
    if (reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts})`);
        connect(token); // 递归调用 connect 函数
      }, reconnectInterval); // 逐渐增加重连间隔时间
    } else {
      console.error('Maximum reconnection attempts reached.');
    }
  };

  websocket.value.onerror = function (error) {
    console.error('WebSocket Error:', error);
    connected.value = false;
  };

  websocket.value.onmessage = function (event) {
    const data = JSON.parse(event.data);
    handleMessage(data);
  };
}

function handleMessage(data) {
  let index = '0';
  let privilege = '';
  let title = '';
  let path = '';
  switch (data.label) {
    case 'applyAuth':
      index = '1';
      privilege = 'approve:auth:list';
      title = '实名认证';
      path = '/approve/auth';
      break;
    case 'applyCash':
      index = '2';
      privilege = 'approve:cash:list';
      title = '用户提现';
      path = '/approve/cash';
      break;
    case 'informUser':
      index = '3';
      privilege = 'inform:user:list';
      title = '举报用户';
      path = '/inform/user';
      break;
    case 'informGroup':
      index = '4';
      privilege = 'inform:group:list';
      title = '举报群聊';
      path = '/inform/group';
      break;
    case 'feedback':
      index = '5';
      privilege = 'operate:feedback:list';
      title = '建议反馈';
      path = '/operate/feedback';
      break;
    case 'applyBanned':
      index = '6';
      privilege = 'approve:banned:list';
      title = '账号解封';
      path = '/approve/banned';
      break;
    case 'applySpecial':
      index = '7';
      privilege = 'approve:special:list';
      title = '异常账户';
      path = '/approve/special';
      break;

  }
  if (index === '0') {
    return;
  }
  // 权限
  if (!_.includes(privilegeList.value, privilege)) {
    return;
  }
  // 移除数字
  removeMessage(index);
  // 推送页面
  messages.value.push({
    index: index,
    title: title,
    count: parseInt(data.value, 10),
    path: path,
  });
  // 页面排序
  messages.value.sort((a, b) => a.index - b.index);
  // 计算总数
  let messageValue = 0;
  messages.value.forEach((item) => {
    messageValue += item.count;
  });
  // 系统播报
  if (messageCount.value < messageValue) {
    setTimeout(() => {
      speechSynthesis(messageValue);
    }, 1000);
  }
  // 系统赋值
  messageCount.value = messageValue;
}

// 根据 index 删除消息
function removeMessage(index) {
  // 方法一：使用 splice
  const indexToRemove = messages.value.findIndex((message) => message.index === index);
  if (indexToRemove !== -1) {
    messages.value.splice(indexToRemove, 1);
  }
}

onMounted(queryToken);

function queryToken() {
  let token = localRead(LocalStorageKeyConst.USER_TOKEN);
  connect(token);
}

const loading = ref(false);
const show = ref(false);

// ------------------------- 路由跳转  -------------------------

function speechSynthesis(messageValue) {
  if (messageCount.value === 0) {
    return;
  }
  // 只播放最新消息
  if (messageValue < messageCount.value) {
    return;
  }
  // 创建语音合成对象
  let speech = new SpeechSynthesisUtterance("你有" + messageCount.value + "条任务需要处理");
  // 设置语音属性
  speech.lang = "zh-CN";
  speech.volume = 1; // 音量
  speech.rate = 1; // 语速
  speech.pitch = 1; // 音调
  // 开始语音合成
  window.speechSynthesis.speak(speech);
}

// ------------------------- 路由跳转  -------------------------

const router = useRouter();
function gotoMessage(path) {
  show.value = false;
  router.push({ path: path });
}
</script>

<style lang="less" scoped>
@smart-page-tag-operate-width: 40px;
@color-primary: v-bind('token.colorPrimary');

.message-container {
  border: #eeeeee solid 1px;
}

:deep(.ant-dropdown-menu-item-selected) {
  background: none !important;
  color: inherit !important;
}
</style>
