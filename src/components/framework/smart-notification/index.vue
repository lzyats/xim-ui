<template>
  <div></div>
</template>

<script setup>
import { onMounted, h } from 'vue';
import { CheckCircleOutlined } from '@ant-design/icons-vue';
import { notification } from 'ant-design-vue';

const message = '使用说明';
const description = '感谢您选择我们的软件系统，我们致力于为您提供最好的用户服务体验。';
const mode = import.meta.env.MODE;

function showWelcomeNotification() {
  if (mode === 'test') {
    notification.open({
      message: h('h2', { class: 'welcome-title' }, message),
      description: h('div', { class: 'welcome-content' }, [
        h('p', {}, description),
        h('div', { class: 'feature-list' }, [
          h('div', { class: 'feature-item' }, [
            h(CheckCircleOutlined),
            h('span', {}, '丰富的功能模块')
          ]),
          h('div', { class: 'feature-item' }, [
            h(CheckCircleOutlined),
            h('span', {}, '完善的文档支持')
          ]),
          h('div', { class: 'feature-item' }, [
            h(CheckCircleOutlined),
            h('span', {}, '优质的售后服务')
          ])
        ]),
      ]),
      class: 'welcome-notification',
      duration: 0,
      placement: 'bottomRight'
    });
  }
}

onMounted(() => {
  showWelcomeNotification();
});
</script>

<style lang="less">
.welcome-notification {
  .ant-notification-notice {
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    animation: slideIn 0.3s ease-out;

    .ant-notification-notice-message {
      margin-bottom: 16px;
    }

    .ant-notification-notice-description {
      font-size: 14px;
      line-height: 1.6;
      color: #4a4a4a;
    }
  }

  .welcome-title {
    font-size: 20px;
    font-weight: 600;
    color: #1f1f1f;
    margin: 0;
  }

  .welcome-content {
    p {
      font-size: 14px;
      line-height: 1.6;
      color: #4a4a4a;
      margin-bottom: 16px;
    }

    .feature-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 20px;

      .feature-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: #f5f5f5;
        border-radius: 6px;
        transition: all 0.3s ease;

        .anticon {
          color: #52c41a;
          font-size: 16px;
        }

        span {
          font-size: 14px;
          color: #1f1f1f;
        }

        &:hover {
          background: #e6f7ff;
          transform: translateX(4px);
        }
      }
    }

    .welcome-footer {
      text-align: right;

      .ant-btn {
        min-width: 100px;
        height: 32px;
        font-size: 14px;
      }
    }
  }
}

@keyframes slideIn {
  from {
    transform: translate(100%, 0);
    opacity: 0;
  }

  to {
    transform: translate(0, 0);
    opacity: 1;
  }
}
</style>