<template>
  <a-card>
    <a-form class="ant-advanced-search-form" :model="notifyForm" autocomplete="off" ref="updateFormRef">
      <a-row :gutter="24" style="height: 650;">
        <a-col :span="12">
          <a-divider orientation="left"> 首页公告 </a-divider>
          <!-- Quill富文本编辑器 -->
          <a-form-item label="公告内容" name="content">
            <div style="border: 1px solid #e8e8e8;">
              <quill-editor
                v-model:content="notifyForm.content"
                :options="editorOptions"
                @ready="handleEditorReady"
                @text-change="handleContentChange"
                style="min-height: 300px;"
              />
            </div>
          </a-form-item>
          <!-- 其他表单内容保持不变 -->
          <a-form-item label="是否显示" name="status" :rules="[{ required: true, message: '不能为空' }]">
            <a-radio-group v-model:value="notifyForm.status">
              <a-radio value="Y">显示公告</a-radio>
              <a-radio value="N">隐藏公告</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="公告类型" name="notype" :rules="[{ required: true, message: '不能为空' }]">
            <a-radio-group v-model:value="notifyForm.notype">
              <a-radio :value="0">走马灯</a-radio>
              <a-radio :value="1">弹窗公告</a-radio>
              <a-radio :value="2">走马+弹窗</a-radio>
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
import { message } from 'ant-design-vue';
import { notifyApi } from '/@/api/operate/notify-api';
import { SmartLoading } from '/@/components/framework/smart-loading/index.js';
import { localRead } from '/@/lib/local-util';
import LocalStorageKeyConst from '/@/constants/local-storage-key-const.js';

// 引入Quill相关资源
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import Quill from 'quill';

// 注册自定义模块或扩展可以在这里添加

const notifyFormState = {
  content: undefined,
  status: undefined,
  notype: 0
};

const updateModalShow = ref(false);
const updateFormRef = ref();
const quillInstance = ref(null); // 用于存储Quill实例

const notifyDemo = ref([]);
const notifyForm = reactive({ ...notifyFormState });


// Quill编辑器配置
// Quill配置
const editorOptions = {
  theme: 'snow',
  placeholder: '请输入公告内容...',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline'],        // 加粗，斜体，下划线，删除线
      [{ 'header': 1 }, { 'header': 2 }],               // 标题，键值对的形式；1、2表示字体大小
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],     // 列表
      [{ 'script': 'sub'}, { 'script': 'super' }],      // 上下标
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // 缩进
      [{ 'size': ['small', false, 'large', 'huge'] }],  // 字体大小
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],        // 几级标题
      [{ 'color': [] }, { 'background': [] }],          // 字体颜色，字体背景颜色
      [{ 'font': [] }],                                 // 字体
      [{ 'align': [] }],                                // 对齐方式
      ['clean','image'],                                         // 清除字体样式
    ]
  },
  // 添加这行配置禁用用水印等可能使用突变事件的功能
  blotFormatter: false
};

let token = localRead(LocalStorageKeyConst.USER_TOKEN);

// 自定义图片上传处理
const handleEditorReady = (editor) => {
  quillInstance.value = editor;
  
  // 获取工具栏中的图片按钮
  const toolbar = editor.getModule('toolbar');
  toolbar.addHandler('image', handleImageUpload);
};

// 请求地址
const REQUEST_PATH = import.meta.env.VITE_APP_REQUEST + '/file/upload';

// 图片上传处理函数
// 图片上传处理函数
const handleImageUpload = () => {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = async () => {
    const file = input.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    

    try {
      const response = await fetch(REQUEST_PATH, {
        method: 'POST',
        body: formData,
        headers:{ Authorization: token }
      });
      const res = await response.json();
      console.log(res);
      if (res.code === 200) {
        // 获取当前光标位置
        const range = quillInstance.value.getSelection();
        // 插入图片
        quillInstance.value.insertEmbed(range.index, 'image', res.data.filePath);
        // 移动光标到图片后面
        quillInstance.value.setSelection(range.index + 1);
      } else {
        message.error('图片上传失败: ' + res.msg);
      }
    } catch (error) {
      message.error('图片上传失败，请重试');
    }
  };
};

// 处理富文本内容变化
const handleContentChange = () => {
  updateForm.content = content;
};

// 打开编辑弹框
function openUpdateModal(record) {
  Object.assign(notifyForm, {
    ...record,
    content: record.content || ''
  });
  updateModalShow.value = true;

  // 延迟设置编辑器内容（确保编辑器已初始化）
  setTimeout(() => {
    if (quillInstance.value && record.content) {
      quillInstance.value.pasteHTML(record.content);
    }
  }, 300);
}

// 关闭编辑弹框
function closeUpdateModal() {
  Object.assign(notifyForm, notifyFormState);
  updateModalShow.value = false;
  // 重置编辑器内容
  if (quillInstance.value) {
    quillInstance.value.setText('');
  }
}

async function queryData() {
  try {
    let versionConfig = await notifyApi.getNotifyInfo();
    let versionDemo = await notifyApi.getNotifyDemo();
    notifyDemo.value = versionDemo.data;
    Object.assign(notifyForm, versionConfig.data);
    
    // 设置编辑器内容
    setTimeout(() => {
      if (quillInstance.value && notifyForm.content) {
        quillInstance.value.pasteHTML(notifyForm.content);
      }
    }, 300);
  } finally {
  }
}

function setItem(e) {
  notifyForm.content = e;
  
  // 设置编辑器内容
  setTimeout(() => {
    if (quillInstance.value && notifyForm.content) {
      quillInstance.value.pasteHTML(e);
    }
  }, 300);
}

// 确认更新
async function confirmUpdate(actType) {
  updateFormRef.value.validate().then(async () => {
    // 获取编辑器内容（HTML格式）
    let htmlContent = quillInstance.value.root.innerHTML;
    
    // 过滤Vue相关语法并转换为正常网页代码
    const filteredContent = filterVueSyntax(htmlContent);
    notifyForm.content = filteredContent;
    
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

// 过滤Vue语法的函数（保持不变）
function filterVueSyntax(html) {
  // 移除v-开头的指令属性
  let filtered = html.replace(/v-[a-z-]+="[^"]*"/gi, '');
  
  // 移除{{ }}插值表达式
  filtered = filtered.replace(/\{\{[^}]+\}\}/gi, '');

  // 移除Vue组件标签（假设组件标签包含连字符）
  filtered = filtered.replace(/<\/?[a-z-]+[^>]*>/gi, (match) => {
    // 保留基础HTML标签，移除自定义组件标签
    const basicTags = /<\/?(div|p|span|a|img|h[1-6]|ul|li|ol|strong|em|u|br|table|tr|td|th|tbody|thead|tfoot|blockquote|code)/i;
    return basicTags.test(match) ? match : '';
  });
  
  return filtered;
}

onMounted(queryData);
</script>
<style scoped>
/* 保持原有样式，添加Quill相关样式调整 */
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

/* Quill编辑器样式调整 */
:deep(.ql-container) {
  min-height: 300px;
  border-top: 1px solid #e8e8e8 !important;
}

:deep(.ql-toolbar) {
  border-bottom: none !important;
}
</style>