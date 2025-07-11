<template>
  <div class="chat-call-record">
    <div class="call-icon">
      <SoundOutlined v-if="type === 'voice'" />
      <VideoCameraOutlined v-else />
    </div>
    <div class="call-info">
      <div class="call-status" :class="statusClass">
        {{ callStatusText }}
      </div>
      <div class="call-duration" v-if="duration && status === 'finish'">
        通话时长: {{ formatDuration }}
      </div>
    </div>
  </div>
</template>

<script>
import { SoundOutlined, VideoCameraOutlined } from '@ant-design/icons-vue'

export default {
  name: 'ChatCall',
  components: {
    SoundOutlined,
    VideoCameraOutlined
  },
  props: {
    type: {
      type: String,
      default: 'voice',
      validator: value => ['voice', 'video'].includes(value)
    },
    status: {
      type: String,
      default: 'finish',
      validator: value => ['finish', 'cancel', 'reject'].includes(value)
    },
    duration: {
      type: Number,
      default: 0
    }
  },
  computed: {
    statusClass() {
      return {
        'status-finish': this.status === 'finish',
        'status-cancel': this.status === 'cancel',
        'status-reject': this.status === 'reject',
      }
    },
    callStatusText() {
      const statusMap = {
        finish: '通话结束',
        cancel: '取消通话',
        reject: '拒绝通话',
      }
      return statusMap[this.status]
    },
    formatDuration() {
      const minutes = Math.floor(this.duration / 60)
      const seconds = this.duration % 60
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-call-record {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f7f7f7;
  border-radius: 8px;
  margin: 8px 0;

  .call-icon {
    font-size: 24px;
    margin-right: 12px;
    color: #409eff;
    display: flex;
    align-items: center;
  }

  .call-info {
    flex: 1;

    .call-status {
      font-weight: 500;
      margin-bottom: 4px;

      &.status-finish {
        color: #67c23a;
      }

      &.status-cancel,
      &.status-reject {
        color: #f56c6c;
      }
    }

    .call-duration {
      font-size: 13px;
      color: #909399;
    }
  }
}
</style>