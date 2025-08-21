<template>
  <a-card>
    <a-form class="ant-advanced-search-form" :model="notifyForm" autocomplete="off" ref="updateFormRef">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-divider orientation="left"> 首页公告 </a-divider>
          <a-form-item label="公告内容" name="content" :rules="[{ required: true, message: '不能为空' }]">
            <a-textarea v-model:value="notifyForm.content" :rows="6" :maxlength="200" />
          </a-form-item>
          <a-form-item label="是否显示" name="status" :rules="[{ required: true, message: '不能为空' }]">
            <a-radio-group v-model:value="notifyForm.status">
              <a-radio value="Y">显示公告</a-radio>
              <a-radio value="N">隐藏公告</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item style="text-align: center">
            <a-button style="margin-right: 25px;" type="primary" v-privilege="'operate:notify:edit'"
              @click="confirmUpdate('保存')">
              保存
            </a-button>
            <a-button type="primary" v-privilege="'operate:notify:edit'" @click="confirmUpdate('推送')">
              保存并推送
            </a-button>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-divider orientation="left"> 公告模板</a-divider>
          <div class="chatTop-list">
            <div class="chatTop-item" v-for="(item, i) in notifyDemo" :key="i" @click="setItem(item)">{{ item }}</div>
          </div>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import { message, } from 'ant-design-vue';
import { notifyApi } from '/@/api/operate/notify-api';
import { SmartLoading } from '/@/components/framework/smart-loading/index.js';

// ---------------------------- 表格列 ----------------------------

const notifyFormState = {
  content: undefined,
  status: undefined,
};
const updateFormRef = ref();

const notifyDemo = ref([]);
// 查询表单form
const notifyForm = reactive({ ...notifyFormState });

async function queryData() {
  try {
    let versionConfig = await notifyApi.getNotifyInfo();
    let versionDemo = await notifyApi.getNotifyDemo();
    notifyDemo.value = versionDemo.data;
    Object.assign(notifyForm, versionConfig.data);
  } finally {
  }
}
function setItem(e) {
  notifyForm.content = e
};
// 确认更新
async function confirmUpdate(actType) {
  updateFormRef.value.validate().then(async () => {
    SmartLoading.show();
    if (actType === '保存') {
      await notifyApi.notifyEdit(notifyForm);
      message.success('保存成功');
    } else {
      await notifyApi.notifyPush(notifyForm);
      message.success('推送成功');
    }
    queryData();
  });
}

onMounted(queryData);
</script>
<style scoped>
.chatTop-list {
  display: flex;
  flex-direction: column;
  margin-top: 12px;
}

.chatTop-item {
  border: 1px #ccc solid;
  padding: 12px;
  margin-bottom: 12px;
  cursor: pointer;
  border-radius: 6px;
}

.chatTop-item:hover {
  background-color: #eee;
}
</style>