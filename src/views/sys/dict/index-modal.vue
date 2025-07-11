<template>
  <a-modal :open="visible" :title="updateForm.dictId ? '编辑' : '添加'" ok-text="确认" cancel-text="取消" @ok="onSubmit"
    @cancel="onClose">
    <a-form ref="formRef" :model="updateForm" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
      <a-form-item label="编码" name="dictCode">
        <a-input v-model:value="updateForm.dictCode" placeholder="请输入编码" :maxlength="20" :showCount="true" />
      </a-form-item>
      <a-form-item label="名称" name="dictName">
        <a-input v-model:value="updateForm.dictName" placeholder="请输入名称" :maxlength="20" :showCount="true" />
      </a-form-item>
      <a-form-item label="排序" name="dictSort">
        <a-input-number v-model:value="updateForm.dictSort" :min="0" :max="9999" style="width: 100%" />
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-textarea :auto-size="{ minRows: 1, maxRows: 4 }" v-model:value="updateForm.remark" :maxlength="200"
          :showCount="true" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup>
import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { dictApi } from '/@/api/sys/dict-api';

// emit
const emit = defineEmits(['reloadList']);

//  组件
const formRef = ref();

const formDefault = {
  dictId: undefined,
  dictType: undefined,
  dictSort: 0,
  dictCode: '',
  dictName: '',
  remark: '',
};
let updateForm = reactive({ ...formDefault });
const rules = {
  dictCode: [{ required: true, message: '请输入编码' }],
  dictName: [{ required: true, message: '请输入名称' }],
};
// 是否展示
const visible = ref(false);

function showModal(rowData, dictType) {
  Object.assign(updateForm, formDefault);
  if (rowData) {
    Object.assign(updateForm, rowData);
  }
  updateForm.dictType = dictType;
  visible.value = true;
}

function onClose() {
  Object.assign(updateForm, formDefault);
  visible.value = false;
}

function onSubmit() {
  formRef.value.validate().then(async () => {
    SmartLoading.show();
    if (updateForm.dictId) {
      await dictApi.editDict(updateForm);
    } else {
      await dictApi.addDict(updateForm);
    }
    message.success(`${updateForm.dictId ? '修改' : '添加'}成功`);
    emit('reloadList');
    onClose();
  });
}

defineExpose({
  showModal,
});
</script>
