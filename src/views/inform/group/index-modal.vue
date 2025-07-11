<template>
  <a-drawer title="群组举报" :width="800" :open="visible" :body-style="{ paddingBottom: '80px' }" @close="onClose">
    <a-card style="margin-bottom: 15px" size="small">
      <a-divider orientation="left">举报人：</a-divider>
      <a-descriptions :column="2" size="small">
        <a-descriptions-item label="用户昵称">{{ chatGroup.nickname }}</a-descriptions-item>
        <a-descriptions-item label="用户编号">{{ chatGroup.userNo }}</a-descriptions-item>
      </a-descriptions>
      <a-divider orientation="left">被举报群：</a-divider>
      <a-descriptions :column="2" size="small">
        <a-descriptions-item label="群组名称">{{ chatGroup.groupName }}</a-descriptions-item>
        <a-descriptions-item label="群组编号">{{ chatGroup.groupNo }}</a-descriptions-item>
      </a-descriptions>
      <a-divider orientation="left">举报信息：</a-divider>
      <a-descriptions :column="2" size="small">
        <a-descriptions-item label="举报时间">{{ chatGroup.createTime }}</a-descriptions-item>
        <a-descriptions-item label="举报类型">{{ chatGroup.informTypeLabel }}</a-descriptions-item>
      </a-descriptions>
      <a-descriptions :column="1" size="small">
        <a-descriptions-item label="举报内容">{{ chatGroup.content }}</a-descriptions-item>
        <a-descriptions-item v-if="chatGroup.images">附件信息：</a-descriptions-item>
        <a-descriptions-item v-if="chatGroup.images">
          <div class="image-grid">
            <div v-for="(item, index) in chatGroup.images" :key="index" class="image-item">
              <a-image :width="200" :src="item" lazy />
            </div>
          </div>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <div class="footer">
      <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
      <a-button v-if="chatGroup.status == 'N'" type="primary" style="margin-right: 8px"
        @click="HandInformGroup(chatGroup.informId)">处理</a-button>
    </div>
  </a-drawer>
</template>

<script setup>
import { ref, } from 'vue';
import { message } from 'ant-design-vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
import _ from 'lodash';
import { informGroupApi } from '/@/api/inform/inform-group-api';

// emit
const emit = defineEmits(['reloadList']);

// 组件
const chatGroup = ref({});

// 是否展示抽屉
const visible = ref(false);

function showModal(record) {
  visible.value = true;
  chatGroup.value = record;
}

function onClose() {
  visible.value = false;
}




async function HandInformGroup(informId) {
  SmartLoading.show();
  await informGroupApi.ignoreGroup(informId);
  message.success('处理成功');
  emit('reloadList');
  onClose();
}

defineExpose({
  showModal,
});
</script>
<style lang="less" scoped>
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
</style>