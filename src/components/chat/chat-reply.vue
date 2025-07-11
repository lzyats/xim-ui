<template>
  <div class="business-card">
    <div>
      <div>
        <div class="id">
          引用消息：{{nickname}}：<a @click="showDrawer">{{ title }}</a>
        </div>
      </div>
    </div>
    <!-- 抽屉 -->
    <a-drawer
      v-model:open="open"
      class="custom-class"
      root-class-name="root-class-name"
      :root-style="{ color: 'blue' }"
      style="color: red"
      title="引用消息查看"
      placement="right"
    >
     <div style="text-align: center;">
      <p v-if="props.data.msgType == 'card'">
        <ChatCard :nickname="dataobj.nickname" :portrait="dataobj.portrait" :userNo="dataobj.userNo"></ChatCard>
      </p>
      <p v-if="props.data.msgType == 'text'">
        {{ dataobj.data }}
      </p>
      <p v-if="props.data.msgType == 'reply'">
        {{ dataobj.data }}
      </p>
      <p v-if="props.data.msgType == 'image'">
        <a-image :width="100" :src="dataobj.data" />
      </p>

      <p v-if="props.data.msgType == 'file'">
        <ChatFile :data="dataobj.data" :title="dataobj.title" :size="dataobj.size"></ChatFile>
      </p>

      <p v-if="props.data.msgType == 'location'">
        <a-image :width="100" :src="dataobj.thumbnail" />
      </p>

      <p v-if="props.data.msgType == 'video'">
        <ChatVideo :src="dataobj.data"></ChatVideo>
      </p>

      <p  v-if="props.data.msgType == 'forward'">
        <ChatForward :data="dataobj"> </ChatForward>
      </p>
     </div>
    </a-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ChatCard from '/@/components/chat/chat-user-card.vue';
import ChatVoice from '/@/components/chat/chat-voice.vue';
import ChatVideo from '/@/components/chat/chat-video.vue';

import ChatFile from '/@/components/chat/chat-file.vue';
import ChatForward from '/@/components/chat/chat-forward.vue';
import ChatReply from '/@/components/chat/chat-reply.vue';

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});
const open = ref(false);

const showDrawer = () => {
  open.value = true;
};
const title = ref('');
const nickname = ref('');
const dataobj = ref({}); // 初始化为一个空对象
onMounted(() => {
  if (props.data && typeof props.data === 'object') {
    dataobj.value = JSON.parse(props.data.content);
    title.value = getMessageType(props.data.msgType);
    nickname.value = props.data.nickname;
  } else {
    console.error('Invalid data prop:', props.data);
  }
});

const getMessageType = (data) => {
  switch (data) {
    case 'text':
      return '文本消息';
    case 'image':
      return '图片消息';
    case 'video':
      return '视频消息';
    case 'file':
      return '文件消息';
    case 'forward':
      return '转发消息';
    case 'card':
      return '名片消息';
    case 'location':
      return '位置消息';
      case 'reply':
      return '引用消息';
  }
  return '未知消息类型';
};
</script>

<style scoped>
.business-card {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 8px;
  width: 250px;
  padding-top: 10px;
}
.id {
  font-size: 14px;
  color: #666;
  font-weight: bold;
}
</style>