<template>
  <a-drawer title="建议反馈" :width="750" :open="visible" :body-style="{ paddingBottom: '80px' }" @close="onClose">
    <a-card style="margin-bottom: 15px" size="small">
      <a-descriptions :column="2" size="small">
        <a-descriptions-item label="用户昵称">{{ chatUser.nickname }}</a-descriptions-item>
        <a-descriptions-item label="用户编号">{{ chatUser.userNo }}</a-descriptions-item>
        <a-descriptions-item label="APP版本">{{ chatUser.version }}</a-descriptions-item>
        <a-descriptions-item label="反馈日期">{{ chatUser.createTime }}</a-descriptions-item>
      </a-descriptions>
      <a-descriptions :column="1" size="small">
        <a-descriptions-item label="反馈内容">{{ chatUser.content }}</a-descriptions-item>
        <a-descriptions-item >附件信息:</a-descriptions-item>
        <a-descriptions-item >
          <div class="image-grid">
            <div v-for="(item, index) in chatUser.images" :key="index" class="image-item">
              <a-image :width="180" :src="item" lazy />
            </div>
          </div>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <div class="footer">
      <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
    </div>
  </a-drawer>
</template>

<script setup>
import { ref, computed } from 'vue';
import _ from 'lodash';
import { feedbackApi } from '/@/api/operate/feedback-api';

// 分页配置
const pageSize = 8;
const currentPage = ref(1);

// 计算当前页显示的图片
const displayImages = computed(() => {
  if (!chatUser.value.images) return [];
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return chatUser.value.images.slice(start, end);
});

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page;
};

// emit
const emit = defineEmits(['reloadList']);

// 组件
const chatUser = ref({});

// 是否展示抽屉
const visible = ref(false);

function showModal(id) {
  visible.value = true;
  if (id) {
    getAuthInfo(id);
  }
}

function onClose() {
  visible.value = false;
}

async function getAuthInfo(id) {
  const result = await feedbackApi.queryFeedbackInfo(id);
  chatUser.value = result.data;
}

defineExpose({
  showModal,
});
</script>
<style lang="less" scoped>
.footer {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e9e9e9;
  padding: 10px 16px;
  background: #fff;
  text-align: left;
  z-index: 1;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 12px;
  margin-bottom: 16px;
}

.image-item {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }

  :deep(.ant-image) {
    border-radius: 4px;
    overflow: hidden;
  }
}
</style>