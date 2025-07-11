<template>
  <a-drawer title="实名认证" :width="800" :open="visible" :body-style="{ paddingBottom: '80px' }" @close="onClose">
    <a-card style="margin-bottom: 15px" size="small">
      <a-divider orientation="left">证件信息：</a-divider>
      <a-descriptions :column="3" size="small">
        <a-descriptions-item label="证件正面">
          <a-image :height="100" :src="chatUser.identity1" />
        </a-descriptions-item>
        <a-descriptions-item label="证件反面">
          <a-image :height="100" :src="chatUser.identity2" />
        </a-descriptions-item>
        <a-descriptions-item label="手持证件" v-if="chatUser.holdCard">
          <a-image :height="100" :src="chatUser.holdCard" />
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <a-card size="small">
      <a-divider orientation="left">实名信息：</a-divider>
      <a-form ref="formRef" :model="updateForm" :rules="rules" :label-col="{ span: 3 }">
        <a-form-item label="用户姓名" name="name">
          <a-input v-model:value="updateForm.name" placeholder="用户姓名" />
        </a-form-item>
        <a-form-item label="身份证号" name="idCard">
          <a-input v-model:value="updateForm.idCard" placeholder="身份证号" />
        </a-form-item>
        <a-form-item label="审批状态" name="status">
          <a-radio-group v-model:value="updateForm.status">
            <a-radio-button value="Y">实名通过</a-radio-button>
            <a-radio-button value="N">实名驳回</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="驳回原因" name="reason" v-if="updateForm.status === 'N'">
          <a-input v-model:value="updateForm.reason" placeholder="驳回原因" />
        </a-form-item>
        <a-form-item label="驳回模板" v-if="updateForm.status === 'N'">
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
import { approveAuthApi } from '/@/api/approve/approve-auth-api';

// emit
const emit = defineEmits(['reloadList']);

// 组件
const formRef = ref(null);
const chatUser = ref({});
const notify = ref([
  '请上传清晰完整的[身份证国徽]照片',
  '请上传清晰完整的[身份证人像]照片',
  '请上传清晰完整的[手持身份证]照片',
  '用户和身份证信息不符合',
]);
// 是否展示抽屉
const visible = ref(false);

function showModal(userId) {
  visible.value = true;
  if (userId) {
    updateForm.userId = userId;
    getAuthInfo(userId);
  }
  nextTick(() => {
    formRef.value?.resetFields();
  });
}

function setItem(e) {
  updateForm.reason = e
};

function onClose() {
  visible.value = false;
  formRef.value?.resetFields();
}

// 表单
const formDefault = {
  userId: undefined,
  name: undefined,
  idCard: undefined,
  status: undefined,
  reason: undefined,
};
let updateForm = reactive({ ...formDefault });

const rules = {
  name: [{ required: true, message: '不能为空' }],
  idCard: [{ required: true, message: '不能为空' }],
  status: [{ required: true, message: '不能为空' }],
  reason: [{ required: true, message: '不能为空' }],
};

async function getAuthInfo(userId) {
  const result = await approveAuthApi.queryAuthInfo(userId);
  chatUser.value = result.data;
  updateForm.idCard = result.data.idCard.trim();
  updateForm.name = result.data.name.trim();
}

function onSubmit() {
  formRef.value.validate()
    .then(async () => {
      SmartLoading.show();
      await approveAuthApi.authEdit(updateForm);
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

.chatTop-item {
  border: 1px #ccc solid;
  padding: 6px;
  margin-bottom: 6px;
  cursor: pointer;
  border-radius: 6px;
}
</style>