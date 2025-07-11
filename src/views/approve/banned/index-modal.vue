<template>
  <a-drawer title="用户解封处置" :width="800" :open="visible" :body-style="{ paddingBottom: '80px' }" @close="onClose">
    <a-card style="margin-bottom: 15px" size="small">
      <a-divider orientation="left">用户信息：</a-divider>
      <a-descriptions :column="2" size="small">
        <a-descriptions-item label="用户昵称">{{ chatUser.nickname }}</a-descriptions-item>
        <a-descriptions-item label="用户编号">{{ chatUser.userNo }}</a-descriptions-item>
        <a-descriptions-item label="手机号码">{{ chatUser.phone }}</a-descriptions-item>
        <a-descriptions-item label="解封日期">{{ chatUser.bannedTime }}</a-descriptions-item>
        <a-descriptions-item label="封禁原因">{{ chatUser.bannedReason }}</a-descriptions-item>
        <a-descriptions-item label="申请说明">{{ chatUser.content }}</a-descriptions-item>
      </a-descriptions>
      <a-descriptions :column="2" size="small">
        <a-descriptions-item label="附件信息">
          <div v-for="(item, index) in chatUser.images" :key="index" style="margin-right: 10px;">
            <a-image :width="100" :src="item" />
          </div>
        </a-descriptions-item>
      </a-descriptions>
      <a-form ref="formRef" :model="updateForm" :rules="rules">
        <a-form-item label="审批状态" name="status">
          <a-radio-group v-model:value="updateForm.status">
            <a-radio-button value="Y">同意解封</a-radio-button>
            <a-radio-button value="N">忽略解封</a-radio-button>
          </a-radio-group>
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
import { approveBannedApi } from '/@/api/approve/approve-banned-api';

// emit
const emit = defineEmits(['reloadList']);

// 组件
const formRef = ref(null);
const chatUser = ref({});

// 是否展示抽屉
const visible = ref(false);

function showModal(userId) {
  visible.value = true;
  if (userId) {
    updateForm.userId = userId;
    queryInfo(userId);
  }
  nextTick(() => {
    formRef.value?.resetFields();
  });
}

function onClose() {
  visible.value = false;
  formRef.value?.resetFields();
}

// 表单
const formDefault = {
  userId: undefined,
  status: undefined,
};

let updateForm = reactive({ ...formDefault });

const rules = {
  status: [{ required: true, message: '不能为空' }],
};

async function queryInfo(userId) {
  const result = await approveBannedApi.queryInfo(userId);
  chatUser.value = result.data;
}

function onSubmit() {
  formRef.value.validate()
    .then(async () => {
      SmartLoading.show();
      await approveBannedApi.banned(updateForm);
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
</style>