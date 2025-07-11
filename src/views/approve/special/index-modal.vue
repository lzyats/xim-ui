<template>
  <a-drawer title="异常处理" :width="800" :open="visible" :body-style="{ paddingBottom: '80px' }" @close="onClose">
    <a-card style="margin-bottom: 15px" size="small">
      <a-divider orientation="left">用户信息：</a-divider>
      <a-descriptions :column="2" size="small">
        <a-descriptions-item label="用户编号">{{ chatUser.userNo }}</a-descriptions-item>
        <a-descriptions-item label="用户昵称">{{ chatUser.nickname }}</a-descriptions-item>
        <a-descriptions-item label="手机号码">{{ chatUser.phone }}</a-descriptions-item>
      </a-descriptions>

      <a-form ref="formRef" :model="updateForm">
        <a-form-item label="处理状态" name="status">
          <a-radio-group v-model:value="updateForm.status">
            <a-radio-button value="N">单次忽略</a-radio-button>
            <a-radio-button value="R">永久忽略</a-radio-button>
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
import { approveSpecialApi } from '/@/api/approve/approve-special-api';

// emit
const emit = defineEmits(['reloadList']);

// 组件
const formRef = ref(null);
const chatUser = ref({});


// 是否展示抽屉
const visible = ref(false);

function showModal(record) {
  visible.value = true;
  updateForm = record;
  updateForm.status = 'N';
  chatUser.value = record;
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

function onSubmit() {
  formRef.value.validate()
    .then(async () => {
      SmartLoading.show();
      await approveSpecialApi.specialEdit(updateForm);
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