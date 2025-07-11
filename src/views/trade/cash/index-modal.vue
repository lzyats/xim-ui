<template>
  <a-drawer title="提现详情" :width="600" :open="visible" :body-style="{ paddingBottom: '80px' }" @close="onClose">
    <a-card style="margin-bottom: 15px" size="small">
      <a-divider orientation="left">用户信息</a-divider>
      <a-descriptions :column="2" size="small">
        <a-descriptions-item label="用户昵称">{{ chatUser.nickname }}</a-descriptions-item>
        <a-descriptions-item label="用户编号">{{ chatUser.userNo }}</a-descriptions-item>
        <a-descriptions-item label="手机号码">{{ chatUser.phone }}</a-descriptions-item>
      </a-descriptions>
      <a-divider orientation="left">提现信息</a-divider>
      <a-descriptions :column="2" size="small">
        <a-descriptions-item label="提现姓名">{{ chatUser.name }}</a-descriptions-item>
        <a-descriptions-item label="提现账户">{{ chatUser.wallet }}</a-descriptions-item>
        <a-descriptions-item label="处理状态">
          <a-tag v-if="chatUser.tradeStatus == '1'" color="warning">{{ chatUser.tradeStatusLabel }}</a-tag>
          <a-tag v-if="chatUser.tradeStatus == '2'" color="success">{{ chatUser.tradeStatusLabel }}</a-tag>
          <a-tag v-if="chatUser.tradeStatus == '3'" color="error">{{ chatUser.tradeStatusLabel }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="驳回原因">{{ chatUser.reason }}</a-descriptions-item>
        <a-descriptions-item label="创建日期">{{ chatUser.createTime }}</a-descriptions-item>
        <a-descriptions-item label="处理日期">{{ chatUser.updateTime }}</a-descriptions-item>
      </a-descriptions>
      <a-divider orientation="left">付款信息</a-divider>
      <a-descriptions :column="2" size="small">
        <a-descriptions-item label="提现金额">{{ chatUser.amount }}</a-descriptions-item>
        <a-descriptions-item label="实际到账">{{ chatUser.balance }}</a-descriptions-item>
        <a-descriptions-item label="手续费用">{{ chatUser.charge }}</a-descriptions-item>
        <a-descriptions-item label="增值服务">{{ chatUser.cost }}</a-descriptions-item>
      </a-descriptions>
      <div style="text-align: center; font-size: 35px; color: red; font-weight: bold">
        实际到账：<span>{{ chatUser.balance }}</span>元
      </div>
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