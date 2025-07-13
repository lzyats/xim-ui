<template>
  <a-row class="smart-table-btn-block">
    <div class="smart-table-operate-block">
    </div>
    <div class="smart-table-setting-block">
      <TableOperator :refresh="queryAuth" :full="false" />
    </div>
  </a-row>
  <a-card style="margin-bottom: 15px" size="small">
    <a-descriptions :column="3" size="small">
      <a-descriptions-item label="用户姓名">{{ chatUser.name }}</a-descriptions-item>
      <a-descriptions-item label="身份证号">{{ chatUser.idCard }}</a-descriptions-item>
      <a-descriptions-item label="认证时间" v-if="chatUser.auth != '0'">
        {{ chatUser.authTime }}
      </a-descriptions-item>
      <a-descriptions-item label="驳回原因" v-if="chatUser.auth == '3'">
        {{ chatUser.authReason }}
      </a-descriptions-item>
      <template v-if="chatUser.auth != '0'">
        <a-descriptions-item label="证件正面">
          <a-image :width="100" :src="chatUser.identity1" />
        </a-descriptions-item>
        <a-descriptions-item label="证件反面">
          <a-image :width="100" :src="chatUser.identity2" />
        </a-descriptions-item>
        <a-descriptions-item label="手持证件" v-if="chatUser.holdCard">
          <a-image :width="100" :src="chatUser.holdCard" />
        </a-descriptions-item>
      </template>
    </a-descriptions>
  </a-card>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import { chatUserApi } from '/@/api/chat/chat-user-api';
import { TableOperator, TABLE_ID } from '/@/components/table-operator';

const props = defineProps({
  userId: {
    type: [Number, String],
  },
});
const chatUser = ref({});
const tableLoading = ref(false);

onMounted(queryAuth);

// 查询详情
async function queryAuth() {
  try {
    tableLoading.value = true;
    const result = await chatUserApi.queryAuth(props.userId);
    chatUser.value = result.data;
  } finally {
    tableLoading.value = false;
  }
}
</script>

<style lang="less" scoped>
:deep(.ant-descriptions-item-content) {
  flex: 1;
  overflow: hidden;
}
</style>