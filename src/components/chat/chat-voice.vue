<template>
  <div class="audio-card">
    <div class="audio">
      <img v-if="!isPlay" class="play-icon" src="/@/assets/images/voice/audio-play.png" @click="audioPlay" />
      <img v-if="isPlay" class="play-icon" src="/@/assets/images/voice/audio-pause.png" @click="audioPause" />
      <div class="audio-main">
        <input type="range" max="100" step="1" class="progress" :style="{ '--progress-value': `${progress}%` }"
          :value="progress" @input="handleChange" @mousedown="handleProgress" />
        <div class="time">
          <span>{{ dateFormart(currentTime) }}</span>
          <span>{{ dateFormart(duration) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  audio: {
    type: String,
    default: '',
  },
  sliderColor: {
    type: String,
    default: '#009EFF',
  },
  activeColor: {
    type: String,
    default: '#009EFF',
  },
  backgroundColor: {
    type: String,
    default: '#EFEFEF',
  },
});

const audio = new Audio();
const isPlay = ref(false);
let timer = null;
const currentTime = ref(0);
const duration = ref(0);
const progress = ref(0);
let intervalID = null;

watch(
  () => props.audio,
  (val) => {
    createAudio();
  },
  { immediate: true }
);

function createAudio() {
  audio.src = props.audio;
  audio.oncanplay = () => {
    duration.value = audio.duration;
    startProgressInterval();
  };
  audio.onplaying = () => {
    isPlay.value = true;
  };
  audio.onpause = () => {
    isPlay.value = false;
  };
  audio.onended = () => {
    isPlay.value = false;
  };
}

// 开始播放
function audioPlay() {
  audio.play();
  isPlay.value = true;
}

// 暂停播放
function audioPause() {
  audio.pause();
  isPlay.value = false;
}

// 拖动进度条
function handleProgress() {
  audio.pause();
}

// 拖动进度条结束
function handleChange(event) {
  const value = event.target.value;
  progress.value = value;
  audio.currentTime = (duration.value * value) / 100;
  audioPlay();
}

// 处理时间格式(总时长转换为时分秒)
function dateFormart(value) {
  value = Number(value).toFixed(0);
  let hour = Math.floor(value / 3600);
  let minute = Math.floor((value - hour * 3600) / 60);
  let second = value - hour * 3600 - minute * 60;
  hour = hour < 10 ? `0${hour}` : hour;
  minute = minute < 10 ? `0${minute}` : minute;
  second = second < 10 ? `0${Math.floor(second)}` : Math.floor(second);
  return `${minute}:${second}`;
}

function startProgressInterval() {
  if (intervalID) {
    clearInterval(intervalID);
  }
  intervalID = setInterval(() => {
    currentTime.value = audio.currentTime;
    progress.value = ((audio.currentTime / duration.value) * 100).toFixed(2);
  }, 100);
}

onMounted(() => {
  createAudio();
});

onUnmounted(() => {
  if (intervalID) {
    clearInterval(intervalID);
  }
  audio.pause();
  audio.currentTime = 0;
});
</script>

<style lang="scss" scoped>
.audio-card {
  height: 100px;
  font-family: 'PingFang SC', sans-serif;
  display: flex;
  flex-direction: column;
  padding: 20px 24px;

  .title {
    color: #333333;
    font-size: 26px;
    font-weight: 500;
  }

  .audio {
    margin-top: 15px;
    display: flex;

    .play-icon {
      width: 40px;
      height: 40px;
    }

    .audio-main {
      height: 48px;
      flex: 1;
      margin-left: 15px;

      .progress {
        width: 100%;
        height: 12px;
        appearance: none;
        /* Remove default styles */
        outline: none;
        /* Remove focus styles */
        background: var(--background-color, #efefef);

        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          /* Override default look */
          appearance: none;
          width: 12px;
          height: 12px;
          background: var(--slider-color, #009eff);
          cursor: pointer;
        }

        &::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: var(--slider-color, #009eff);
          cursor: pointer;
        }
      }

      .time {
        width: 100%;
        height: 50px;
        font-size: 24px;
        font-weight: 400;
        color: #666666;
        margin-top: -15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
}
</style>