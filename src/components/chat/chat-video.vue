<template>
  <video-player class="video-player vjs-big-play-centered" crossorigin="anonymous" playsinline controls
    :options="playerOptions" :volume="0.6" :height="320" :playback-rates="[0.7, 1.0, 1.5, 2.0]" @mounted="handleMounted"
    @ready="handleEvent($event)" @play="handleEvent($event)" @pause="handleEvent($event)" @ended="handleEvent($event)"
    @loadeddata="handleEvent($event)" @waiting="handleEvent($event)" @playing="handleEvent($event)"
    @canplay="handleEvent($event)" @canplaythrough="handleEvent($event)" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
});

const player = ref(null);

const playerOptions = ref({
  sources: [
    {
      type: 'video/mp4', // 确保 MIME 类型正确
      src: props.src,
    },
  ],
  notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
});

const handleMounted = (instance) => {
  player.value = instance;
};

const handleEvent = (event) => {

};

onMounted(() => {
  // 初始化
});

onUnmounted(() => {
  // 清理
});
</script>

<style lang="scss" scoped></style>