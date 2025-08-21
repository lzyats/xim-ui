<template>
  <a-card>
    <a-form class="ant-advanced-search-form" :model="notifyForm" autocomplete="off" ref="updateFormRef">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-divider orientation="left"> 首页公告 </a-divider>
          <!-- 富文本编辑器替换原有文本框 -->
          <a-form-item label="公告内容" name="content" :rules="[{ required: true, message: '不能为空' }]">
            <div style="border: 1px solid #d9d9d9; border-radius: 4px;">
              <!-- 富文本编辑器容器 -->
              <div ref="editorRef" style="min-height: 300px;"></div>
              <!-- 隐藏的表单绑定字段（用于表单验证） -->
              <input 
                type="hidden" 
                v-model="notifyForm.content" >
            </div>
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
import { onMounted, reactive, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { notifyApi } from '/@/api/operate/notify-api';
import { SmartLoading } from '/@/components/framework/smart-loading/index.js';
// 引入富文本编辑器
import { createEditor, createToolbar } from 'wangeditor';

// ---------------------------- 富文本编辑器配置 ----------------------------
const editorRef = ref(null);
const editor = ref(null);
const toolbarRef = ref(null);

// ---------------------------- 表单数据 ----------------------------
const notifyFormState = {
  content: '', // 初始化为空字符串，避免undefined导致问题
  status: undefined,
};
const updateFormRef = ref();
const notifyDemo = ref([]);
const notifyForm = reactive({ ...notifyFormState });

// 初始化富文本编辑器
function initEditor() {
  // 创建编辑器实例
  editor.value = createEditor({
    selector: editorRef.value,
    html: notifyForm.content || '', // 初始化内容
    config: {
      placeholder: '请输入公告内容...',
      maxLength: 200, // 限制最大长度
      // 配置菜单（按需调整）
      toolbarKeys: [
        'bold', 'italic', 'underline', 'through', // 基础格式
        '|',
        'fontSize', 'fontColor', 'bgColor', // 字体设置
        '|',
        'bulletedList', 'numberedList', // 列表
        '|',
        'insertLink', 'insertImage', // 插入链接/图片
        '|',
        'clearStyle', 'fullScreen' // 清除格式/全屏
      ],
      // 实时同步内容到表单
      onChange(editor) {
        notifyForm.content = editor.getHtml();
      }
    }
  });

  // 创建工具栏实例
  const toolbar = createToolbar({
    editor: editor.value,
    config: {
      toolbarKeys: [
        'bold', 'italic', 'underline', 'through',
        '|',
        'fontSize', 'fontColor', 'bgColor',
        '|',
        'bulletedList', 'numberedList',
        '|',
        'insertLink', 'insertImage',
        '|',
        'clearStyle', 'fullScreen'
      ]
    }
  });
}

// 数据查询
async function queryData() {
  try {
    SmartLoading.show();
    let versionConfig = await notifyApi.getNotifyInfo();
    let versionDemo = await notifyApi.getNotifyDemo();
    notifyDemo.value = versionDemo.data;
    Object.assign(notifyForm, versionConfig.data);
    
    // 数据加载后更新编辑器内容
    if (editor.value && notifyForm.content) {
      editor.value.setHtml(notifyForm.content);
    }
  } catch (err) {
    message.error('数据加载失败');
  } finally {
    SmartLoading.hide();
  }
}

// 选择模板
function setItem(content) {
  notifyForm.content = content;
  // 同步到编辑器
  if (editor.value) {
    editor.value.setHtml(content);
  }
}

// 确认更新
async function confirmUpdate(actType) {
  updateFormRef.value.validate().then(async () => {
    SmartLoading.show();
    try {
      if (actType === '保存') {
        await notifyApi.notifyEdit(notifyForm);
        message.success('保存成功');
      } else {
        await notifyApi.notifyPush(notifyForm);
        message.success('推送成功');
      }
      queryData();
    } catch (err) {
      message.error(actType === '保存' ? '保存失败' : '推送失败');
    } finally {
      SmartLoading.hide();
    }
  });
}

// 生命周期
onMounted(() => {
  // 先加载数据，再初始化编辑器
  queryData().then(() => {
    initEditor();
  });
});

// 组件卸载时销毁编辑器
onUnmounted(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});
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

/* 富文本编辑器样式调整 */
:deep(.w-e-text-container) {
  min-height: 300px !important;
  border-top: 1px solid #d9d9d9 !important;
}
</style>