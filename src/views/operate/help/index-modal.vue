<template>
  <div>
    <!-- 编辑 -->
    <a-modal :open="updateModalShow" :width="650" :title="updateForm.helpId ? '编辑' : '添加'" ok-text="确认" cancel-text="取消"
      @cancel="closeUpdateModal" @ok="confirmUpdate">
      <a-form ref="updateFormRef" :model="updateForm" :rules="updateRules" :label-col="{ span: 5 }">
        <a-form-item label="标题" name="title">
          <a-input placeholder="标题" v-model:value="updateForm.title" :maxlength="20" :showCount="true" />
        </a-form-item>
        <a-form-item label="内容" name="content">
          <a-textarea placeholder="内容" v-model:value="updateForm.content" :maxlength="20" :showCount="true" />
        </a-form-item>
        <a-form-item label="排序" name="sort">
          <a-input-number style="width: 100%;" placeholder="排序" v-model:value="updateForm.sort" :min="1" :max="100" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script setup>
import { message } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import { helpApi } from '/@/api/operate/help-api';
import { SmartLoading } from '/@/components/framework/smart-loading/index.js';

// emit
const emit = defineEmits(['reloadList']);

const updateModalShow = ref(false);
const updateFormRef = ref();
const roleList = ref([]);

const updateFormDefault = {
  helpId: undefined,
  title: undefined,
  content: undefined,
  sort: undefined,
};
let updateForm = reactive({ ...updateFormDefault });
const updateRules = {
  title: [{ required: true, message: '请输入' }],
  content: [{ required: true, message: '请输入' }],
  sort: [{ required: true, message: '请输入' }],
};

// 打开编辑弹框
function openUpdateModal(record) {
  Object.assign(updateForm, record);
  updateModalShow.value = true;
}
// 关闭编辑弹框
function closeUpdateModal() {
  Object.assign(updateForm, updateFormDefault);
  updateModalShow.value = false;
}

// 确认更新
async function confirmUpdate() {
  updateFormRef.value
    .validate().then(async () => {
      SmartLoading.show();
      if (updateForm.helpId) {
        await helpApi.helpEdit(updateForm);
      } else {
        await helpApi.helpAdd(updateForm);
      }
      message.success(updateForm.helpId ? '更新成功' : '新增成功');
      closeUpdateModal();
      emit('reloadList');
    });
}

defineExpose({
  openUpdateModal,
});
</script>