<template>
  <a-drawer title="封禁用户" :width="500" :open="visible" @close="onClose">
    <a-form ref="formRef" :model="updateForm" :rules="rules" :label-col="{ span: 5 }">
      <a-form-item label="封禁时间" name="bannedTime">
        <SmartEnumSelect width="100%" v-model:value="updateForm.bannedTime" placeholder="请选择封禁时间"
          enum-name="CODE_BANNED_TIME_ENUM" />
      </a-form-item>
      <a-form-item label="封禁类型" name="bannedType">
        <SmartEnumSelect width="100%" v-model:value="updateForm.bannedType" placeholder="请选择封禁类型"
          enum-name="CODE_BANNED_TYPE_ENUM" />
      </a-form-item>
      <a-form-item label="其他原因" name="reason" v-if="updateForm.bannedType == '6'">
        <a-textarea v-model:value="updateForm.reason" placeholder="其他原因" :maxlength="50" />
      </a-form-item>
    </a-form>
    <div class="footer">
      <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
      <a-button type="primary" @click="onSubmit">提交</a-button>
    </div>
  </a-drawer>
</template>
<script setup>
import { ref, nextTick, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
import _ from 'lodash';
import { chatUserApi } from '/@/api/chat/chat-user-api';
import SmartEnumSelect from '/@/components/framework/smart-enum-select/index.vue';
// emit
const emit = defineEmits(['reloadList']);
// 组件ref
const formRef = ref();
const formDefault = {
  userId: undefined,
  bannedType: undefined,
  reason: undefined,
  bannedTime: undefined,
};
let updateForm = reactive({ ...formDefault });
const rules = {
  bannedType: [{ required: true, message: '不能为空' }],
  reason: [{ required: true, message: '不能为空' }],
  bannedTime: [{ required: true, message: '不能为空' }],
};
// 是否展示抽屉
const visible = ref(false);

function showDrawer(userId) {
  visible.value = true;
  nextTick(() => {
    updateForm.userId = userId;
  });
}

function onClose() {
  Object.assign(updateForm, formDefault);
  visible.value = false;
}

function onSubmit() {
  formRef.value.validate()
    .then(async () => {
      SmartLoading.show();
      let params = _.cloneDeep(updateForm);
      await chatUserApi.bannedUser(params);
      message.success(`操作成功`);
      onClose();
      emit('reloadList');
    });
}

defineExpose({
  showDrawer,
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