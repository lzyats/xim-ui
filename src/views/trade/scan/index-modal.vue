<template>
  <a-drawer title="扫码转账" :width="600" :open="visible" :body-style="{ paddingBottom: '80px' }" @close="onClose">
    <a-card style="margin-bottom: 15px" size="small">
      <a-divider orientation="left">发起用户</a-divider>
      <a-descriptions :column="2" size="small">
        <a-descriptions-item label="用户昵称">{{ chatUser.nickname }}</a-descriptions-item>
        <a-descriptions-item label="用户编号">{{ chatUser.userNo }}</a-descriptions-item>
        <a-descriptions-item label="手机号码">{{ chatUser.phone }}</a-descriptions-item>
      </a-descriptions>
      <a-divider orientation="left">接收用户</a-divider>
      <a-descriptions :column="2" size="small">
        <a-descriptions-item label="用户昵称">{{ chatUser.receiveName }}</a-descriptions-item>
        <a-descriptions-item label="用户编号">{{ chatUser.receiveNo }}</a-descriptions-item>
        <a-descriptions-item label="手机号码">{{ chatUser.receivePhone }}</a-descriptions-item>
      </a-descriptions>
      <a-divider orientation="left">转账信息</a-divider>
      <a-descriptions :column="2" size="small">
        <a-descriptions-item label="转账日期">{{ chatUser.createTime }}</a-descriptions-item>
        <a-descriptions-item label="接收日期">{{ chatUser.updateTime }}</a-descriptions-item>
        <a-descriptions-item label="转账金额">{{ chatUser.amount }}</a-descriptions-item>
        <a-descriptions-item label="备注信息">{{ chatUser.remark }}</a-descriptions-item>
      </a-descriptions>
    </a-card>
    <div class="footer">
      <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
    </div>
  </a-drawer>
</template>

<script setup>
import { ref, } from 'vue';
import _ from 'lodash';
import { tradeApi } from '/@/api/trade/trade-api';

// emit
const emit = defineEmits(['reloadList']);

// 组件
const chatUser = ref({});

// 是否展示抽屉
const visible = ref(false);

function showModal(tradeId) {
  visible.value = true;
  if (tradeId) {
    getAuthInfo(tradeId);
  }
}

function onClose() {
  visible.value = false;
}

async function getAuthInfo(tradeId) {
  const result = await tradeApi.queryTradeInfo(tradeId);
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
</style>