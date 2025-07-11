<template>
  <a-drawer title="用户提现" :width="800" :open="visible" :body-style="{ paddingBottom: '80px' }" @close="onClose">
    <a-card style="margin-bottom: 15px" size="small">
      <a-divider orientation="left">提现信息：</a-divider>
      <a-descriptions :column="2" size="small">
        <a-descriptions-item label="提现姓名">{{ chatUser.name }}</a-descriptions-item>
        <a-descriptions-item label="提现账户">{{ chatUser.wallet }}</a-descriptions-item>
        <a-descriptions-item label="提现金额">{{ chatUser.amount }}</a-descriptions-item>
        <a-descriptions-item label="应付金额">{{ chatUser.balance }}</a-descriptions-item>
        <a-descriptions-item label="手续费用">{{ chatUser.charge }}</a-descriptions-item>
        <a-descriptions-item label="增值服务">{{ chatUser.cost }}</a-descriptions-item>
      </a-descriptions>
      <div class="balance">
        应付：<span>{{ chatUser.balance }}</span>
      </div>
      <a-form ref="formRef" :model="updateForm" :rules="rules">
        <a-form-item label="审批状态" name="status">
          <a-radio-group v-model:value="updateForm.status">
            <a-radio-button value="Y">提现通过</a-radio-button>
            <a-radio-button value="N">提现驳回</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="打款类型" name="auto" v-if="updateForm.status === 'Y'">
          <a-radio-group v-model:value="updateForm.auto">
            <a-radio-button value="Y">自动打款</a-radio-button>
            <a-radio-button value="N">手动打款</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="自动打款" name="verify" v-if="updateForm.auto === 'Y'">
          <a-radio-group v-model:value="updateForm.verify">
            <a-radio-button value="Y">确认打款</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="驳回原因" name="reason" v-if="updateForm.status === 'N'">
          <a-textarea v-model:value="updateForm.reason" placeholder="驳回原因" :maxlength="50" />
        </a-form-item>
        <a-form-item label="驳回模板" v-if="updateForm.status === 'N'" style="margin: 11px">
          <div v-for="(item, i) in notify" :key="i" @click="setItem(item)" class="chatTop-item">
            {{ item }}
          </div>
        </a-form-item>
      </a-form>
    </a-card>
    <div class="footer">
      <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
      <a-button type="primary" @click="onSubmit">确认</a-button>
    </div>
  </a-drawer>
</template>

<script setup>
import { ref, nextTick, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
import _ from 'lodash';
import { approveCashApi } from '/@/api/approve/approve-cash-api';

// emit
const emit = defineEmits(['reloadList']);

// 组件
const formRef = ref(null);
const chatUser = ref({});
const notify = ref([
  '请先进行实名认证',
  '支付宝姓名和实名姓名不符',
  '收款用户状态不正常',
  '收款人未实名不允许收款',
  '收款用户无余额账户不允许收款',
  '收款账户异常，暂不支持收款，请联系对方核实',
]);

// 是否展示抽屉
const visible = ref(false);

function showModal(tradeId) {
  visible.value = true;
  updateForm.tradeId = tradeId;
  queryInfo(tradeId);
  nextTick(() => {
    formRef.value?.resetFields();
  });
}

function setItem(e) {
  updateForm.reason = e
}

function onClose() {
  visible.value = false;
  formRef.value?.resetFields();
}

// 表单
const formDefault = {
  tradeId: undefined,
  status: undefined,
  auto: undefined,
  verify: undefined,
  reason: undefined,
};
let updateForm = reactive({ ...formDefault });

const rules = {
  status: [{ required: true, message: '不能为空' }],
  reason: [{ required: true, message: '不能为空' }],
  auto: [{ required: true, message: '不能为空' }],
  verify: [{ required: true, message: '不能为空' }],
};

async function queryInfo(userId) {
  const result = await approveCashApi.queryInfo(userId);
  chatUser.value = result.data;
}

function onSubmit() {
  formRef.value.validate()
    .then(async () => {
      SmartLoading.show();
      await approveCashApi.cashEdit(updateForm);
      message.success(`操作成功`);
      emit('reloadList');
      onClose();
    });
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

.balance {
  text-align: center;
  font-size: 35px;
  color: red;
  font-weight: bold;
  padding-bottom: 10px;
}

.chatTop-item {
  border: 1px #ccc solid;
  padding: 6px;
  margin-bottom: 6px;
  cursor: pointer;
  border-radius: 6px;
}
</style>