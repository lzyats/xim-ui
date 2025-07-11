<!--
  * JOB 表单
-->
<template>
  <div>
    <!-- 编辑 -->
    <a-modal :open="updateModalShow" :width="650" :title="updateForm.jobId ? '编辑' : '添加'" ok-text="确认" cancel-text="取消"
      @cancel="closeUpdateModal" @ok="confirmUpdateJob">
      <a-form ref="updateFormRef" :model="updateForm" :rules="updateRules" :label-col="{ span: 5 }">
        <a-form-item label="任务名称" name="jobName">
          <a-input placeholder="请输入任务名称" v-model:value="updateForm.jobName" :maxlength="100" :showCount="true" />
        </a-form-item>
        <a-form-item label="执行方法" name="invokeTarget">
          <a-input placeholder="请输入执行方法" v-model:value="updateForm.invokeTarget" :maxlength="100" :showCount="true" />
        </a-form-item>
        <a-form-item label="cron表达式" name="cronExpression" :help="'示例：0 0/5 * * * ? *'">
          <a-input placeholder="请输入表达式" v-model:value="updateForm.cronExpression" :maxlength="100" :showCount="true" />
        </a-form-item>
        <a-form-item label="是否开启" name="status">
          <a-switch v-model:checked="updateForm.status" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 立即执行 -->
    <a-modal :open="executeModalShow" :width="650" title="执行任务" ok-text="执行" cancel-text="取消"
      @cancel="closeExecuteModal" @ok="confirmExecuteJob(executeForm)">
      <br />
      <a-alert type="info" show-icon style="margin-left: 25px">
        <template #message> 点击【执行】后会按照【任务调度】，无论任务是否开启，都会立即执行。 </template>
      </a-alert>
      <br />
      <a-form :label-col="{ span: 5 }">
        <a-form-item label="任务名称" name="jobName">
          <a-input v-model:value="executeForm.jobName" :disabled="true" />
        </a-form-item>
        <a-form-item label="任务类名" name="invokeTarget">
          <a-textarea :auto-size="{ minRows: 1, maxRows: 4 }" :maxlength="200" v-model:value="executeForm.invokeTarget"
            :disabled="true" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script setup>
import { message } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import { jobApi } from '/@/api/quartz/job-api';
import { SmartLoading } from '/@/components/framework/smart-loading/index.js';

// emit
const emit = defineEmits(['reloadList']);

const updateModalShow = ref(false);
const updateFormRef = ref();

const updateFormDefault = {
  jobId: null,
  jobName: '',
  invokeTarget: '',
  cronExpression: '',
  status: false,
};
let updateForm = reactive({ ...updateFormDefault });
const updateRules = {
  jobName: [{ required: true, message: '请输入任务名称' }],
  invokeTarget: [{ required: true, message: '请输入执行方法' }],
  cronExpression: [{ required: true, message: '请输入cron表达式' }],
};

// 打开编辑弹框
function openUpdateModal(record) {
  Object.assign(updateForm, record);
  updateForm.status = record.status === 'Y';
  updateModalShow.value = true;
}

// 关闭编辑弹框
function closeUpdateModal() {
  Object.assign(updateForm, updateFormDefault);
  updateModalShow.value = false;
}

// 确认更新
async function confirmUpdateJob() {
  updateFormRef.value.validate().then(async () => {
    SmartLoading.show();
    updateForm.status = updateForm.status ? 'Y' : 'N';
    if (updateForm.jobId) {
      await jobApi.updateJob(updateForm);
    } else {
      await jobApi.addJob(updateForm);
    }
    message.success(updateForm.jobId ? '更新成功' : '新增成功');
    closeUpdateModal();
    emit('reloadList');
  });
}

// ------------------------------------ 执行任务 -------------------------------------
const executeModalShow = ref(false);
const executeFormDefault = {
  jobId: null,
  jobName: '',
  invokeTarget: '',
};
let executeForm = reactive({ ...executeFormDefault });

// 打开执行弹框
function openExecuteModal(record) {
  Object.assign(executeForm, record);
  executeModalShow.value = true;
}

// 关闭执行弹框
function closeExecuteModal() {
  Object.assign(executeForm, executeFormDefault);
  executeModalShow.value = false;
}

// 确认执行
async function confirmExecuteJob(executeForm) {
  SmartLoading.show();
  await jobApi.runJob(executeForm.jobId);
  message.success('执行成功');
  closeExecuteModal();
  emit('reloadList');
}

defineExpose({
  openUpdateModal,
  openExecuteModal,
});
</script>
