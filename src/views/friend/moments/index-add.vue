<template>
  <a-modal title="添加朋友圈动态" :open="visible" @close="onClose" @ok="onSubmit" @cancel="onClose">
    <a-form ref="formRef" :model="updateForm" :rules="rules" :label-col="{ span: 5 }">
      <a-form-item label="发布用户ID" name="userId">
        <a-input v-model:value="updateForm.userId" placeholder="发布用户ID" />
      </a-form-item>
      <a-form-item label="文字内容" name="content">
        <a-textarea v-model:value="updateForm.content" :maxlength="1000" placeholder="文字内容" />
      </a-form-item>
      <a-form-item label="位置信息" name="location">
        <a-input v-model:value="updateForm.location" placeholder="位置信息（可为空）" />
      </a-form-item>
      <a-form-item label="可见性" name="visibility">
        <a-select v-model:value="updateForm.visibility">
          <a-select-option value="0">公开</a-select-option>
          <a-select-option value="1">私密</a-select-option>
          <a-select-option value="2">部分可见</a-select-option>
          <a-select-option value="3">不给谁看</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, nextTick, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
import _ from 'lodash';
import { friendMomentsApi } from '/@/api/friend/friend-moments-api';

// emit
const emit = defineEmits(['reloadList']);

// 组件ref
const formRef = ref();

const formDefault = {
  userId: undefined,
  content: undefined,
  location: null,
  visibility: 0,
};

let updateForm = reactive({ ...formDefault });

const rules = {
  userId: [{ required: true, message: '用户ID不能为空' }],
  content: [{ required: true, message: '发表内容不能为空' }],
};

// 是否展示抽屉
const visible = ref(false);

function showDrawer() {
  visible.value = true;
  nextTick(() => {
    formRef.value.clearValidate();
  });
}

function onClose() {
  Object.assign(updateForm, formDefault);
  visible.value = false;
}

function onSubmit() {
  console.log(_.cloneDeep(updateForm));
  formRef.value.validate()
    .then(async () => {
      SmartLoading.show();
      let params = _.cloneDeep(updateForm);
      // 确保 location 为空时为 null
      params.location = params.location === '' ? null : params.location;
      await friendMomentsApi.addMoments(params);
      message.success(`操作成功`);
      onClose();
      emit('reloadList');
    })
    .catch(() => {
      message.error('表单验证失败，请检查输入');
    });
}

defineExpose({
  showDrawer,
});
</script>