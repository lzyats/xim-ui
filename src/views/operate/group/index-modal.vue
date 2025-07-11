<template>
  <div>
    <!-- 编辑 -->
    <a-modal :open="updateModalShow" :width="500" :title="updateForm.groupLevel ? '编辑' : '添加'" ok-text="确认"
      cancel-text="取消" @cancel="closeUpdateModal" @ok="confirmUpdate">
      <a-form ref="updateFormRef" :model="updateForm" :rules="updateRules" :label-col="{ span: 5 }">
        <a-form-item label="群组等级" name="groupLevel">
          <a-input placeholder="群组等级" disabled v-model:value="updateForm.groupLevel" :maxlength="20"
            :showCount="true" />
        </a-form-item>
        <a-form-item label="群员人数" name="levelCount">
          <a-input placeholder="群员人数" v-model:value="updateForm.levelCount" :maxlength="20" :showCount="true" />
        </a-form-item>
        <a-form-item label="群组价格" name="levelPrice">
          <a-input-number style="width: 100%;" placeholder="价格" v-model:value="updateForm.levelPrice" :maxlength="100"
            :showCount="true" />
        </a-form-item>
        <a-form-item label="是否启用" name="status">
          <a-radio-group v-model:value="updateForm.status">
            <a-radio value="Y">启用</a-radio>
            <a-radio value="N">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>

    </a-modal>
  </div>
</template>
<script setup>
import { message } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import { groupApi } from '/@/api/operate/group-api';
import { SmartLoading } from '/@/components/framework/smart-loading/index.js';

// emit
const emit = defineEmits(['reloadList']);

const updateModalShow = ref(false);
const updateFormRef = ref();
const roleList = ref([]);

const updateFormDefault = {
  groupLevel: undefined,
  levelCount: undefined,
  levelPrice: undefined,
  status: undefined,
};

let updateForm = reactive({ ...updateFormDefault });
const updateRules = {
  groupLevel: [{ required: true, message: '请输入' }],
  levelCount: [{ required: true, message: '请输入' }],
  levelPrice: [{ required: true, message: '请输入' }],
  status: [{ required: true, message: '请输入' }],
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
  updateFormRef.value.validate().then(async () => {
    SmartLoading.show();
    await groupApi.groupEdit(updateForm);
    message.success('修改成功');
    closeUpdateModal();
    emit('reloadList');
  });
}

defineExpose({
  openUpdateModal,
});
</script>