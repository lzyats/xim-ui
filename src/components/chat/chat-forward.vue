<template>
  <div class="business-card">
    <div>
      <div>
        <div class="id">{{ title }}</div>
      </div>
    </div>
    <div class="footer"><a @click="lookForward">查看记录</a></div>
  </div>
  <ChatForwardMessage ref="chatForwardMessage" :data="dataobj" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ChatForwardMessage from './chat-forward-message.vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const title = ref('');
const dataobj = ref({}); // 初始化为一个空对象

onMounted(() => {
  if (props.data && typeof props.data === 'object') {
    dataobj.value = props.data;
    title.value = dataobj.value.title;
  } else {
    console.error('Invalid data prop:', props.data);
  }
});

const chatForwardMessage = ref();
const lookForward = () => {
  chatForwardMessage.value.showDrawer();
};
</script>

<style scoped>
.business-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 250px;
  padding: 15px;
}

.id {
  font-size: 14px;
  color: #666;
  font-weight: bold;
  text-align: center;
}

.footer {
  font-size: 12px;
  color: #666;
  margin-top: 12px;
  margin-bottom: 3px;
  font-weight: bold;
  text-align: center;
  /* 居中显示 */
}
</style>