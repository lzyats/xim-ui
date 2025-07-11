<template>
  <!-- 编辑 -->
  <a-drawer :width="800" :open="visible" :body-style="{ paddingBottom: '80px' }" title="回复列表" @close="onClose">
    <a-tabs v-model:activeKey="activeKey" :tab-position="tabPosition">
      <a-tab-pane key="1" tab="关注回复">
        <ReplySubscribe ref="replySubscribe" :robotId="robotId" :key="robotId" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="事件回复">
        <ReplyEven ref="replyEven" :robotId="robotId" :key="robotId" />
      </a-tab-pane>
    </a-tabs>
  </a-drawer>
</template>
<script setup>
import { ref } from 'vue';
import ReplySubscribe from './index-reply-subscribe.vue';
import ReplyEven from './index-reply-even.vue';

const emit = defineEmits(['reloadList']);

const tabPosition = ref('left');
const activeKey = ref('1');

const replySubscribe = ref();
const replyEven = ref();
// 请求地址

function onClose() {
  visible.value = false;
}

const robotId = ref('');

const visible = ref(false);

// 打开编辑弹框
function openUpdateModal(record) {
  console.log(record.robotId);
  robotId.value = record.robotId;
  visible.value = true;
}

defineExpose({
  openUpdateModal,
});
</script>