<template>
  <div>
    <!-- 编辑 -->
    <a-modal :open="updateModalShow" :width="750" :title="updateForm.id ? '编辑' : '添加'" ok-text="确认"
      cancel-text="取消" @cancel="closeUpdateModal" @ok="confirmUpdate">
      <a-form ref="updateFormRef" :model="updateForm" :rules="updateRules" :label-col="{ span: 5 }">
        <!-- 公告标题 -->
        <a-form-item label="网页标识" name="roulekey">
          <a-input placeholder="网页标识" v-model:value="updateForm.roulekey" :maxlength="20" :showCount="true" />
        </a-form-item>
        <a-form-item label="简要描述" name="remake">
          <a-input placeholder="简要描述" v-model:value="updateForm.remake" :maxlength="20" :showCount="true" />
        </a-form-item>
        <a-form-item label="跳转地址" name="url">
          <a-input placeholder="跳转地址" v-model:value="updateForm.url" :maxlength="500" :showCount="true" />
        </a-form-item>
        <!-- Quill富文本编辑器 -->
        <a-form-item label="具体内容" name="html">
          <div style="border: 1px solid #e8e8e8">
            <quill-editor
              v-model:content="updateForm.html"
              :options="editorOptions"
              @update:content="handleContentChange"
              @ready="handleEditorReady"
            />
          </div>
        </a-form-item>

        <a-form-item label="发布时间" name="ctime">
          <a-date-picker :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }" valueFormat="YYYY-MM-DD HH:mm:ss"
            v-model:value="updateForm.ctime" style="width: 100%" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup >
import { message } from 'ant-design-vue';
import { reactive, ref, onMounted } from 'vue';
import { noticeApi } from '/@/api/sys/html-api';
import dayjs from 'dayjs';
import { SmartLoading } from '/@/components/framework/smart-loading/index.js';
import { localRead } from '/@/lib/local-util';
import LocalStorageKeyConst from '/@/constants/local-storage-key-const.js';
// 引入Quill编辑器
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
// 引入Quill核心库用于配置
import Quill from 'quill';

// emit
const emit = defineEmits(['reloadList']);

const updateModalShow = ref(false);
const updateFormRef = ref();
const quillInstance = ref(null); // 用于存储Quill实例

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

const updateFormDefault = {
  id:undefined,
  roulekey: undefined,
  remake: undefined,
  html: '',
  ctime: undefined,
  url: undefined
};
let updateForm = reactive({ ...updateFormDefault });

const updateRules = {
  roulekey: [{ required: true, message: '请输入网页标识' }],
  html: [{ required: true, message: '请输入内容' }],
  ctime: [{ required: true, message: '请输入发布时间' }],
};

// 处理富文本内容变化
const handleContentChange = (html) => {
  updateForm.html = html;
};

// 打开编辑弹框
function openUpdateModal(record) {
  Object.assign(updateForm, {
    ...record,
    html: record.html || ''
  });
  updateModalShow.value = true;

  // 延迟设置编辑器内容（确保编辑器已初始化）
  setTimeout(() => {
    if (quillInstance.value && record.html) {
      quillInstance.value.root.innerHTML = record.html;
    }
  }, 300);
}

// 关闭编辑弹框
function closeUpdateModal() {
  Object.assign(updateForm, updateFormDefault);
  updateModalShow.value = false;
  // 重置编辑器内容
  if (quillInstance.value) {
    quillInstance.value.root.innerHTML = '';
  }
}

// 确认更新
async function confirmUpdate() {
  updateFormRef.value.validate().then(async () => {
    let htmlContent = quillInstance.value.root.innerHTML;
    // 过滤Vue相关语法并转换为正常网页代码
    const filteredContent = filterVueSyntax(htmlContent);
    updateForm.html = filteredContent;
    SmartLoading.show();
    console.log(updateForm);
    try {
      if (updateForm.id) {
        await noticeApi.noticeEdit(updateForm);
      } else {
        await noticeApi.noticeAdd(updateForm);
      }
      message.success(updateForm.id ? '更新成功' : '新增成功');
      closeUpdateModal();
      emit('reloadList');
    } finally {
      SmartLoading.hide();
    }
  });
}

// 过滤Vue语法的函数
function filterVueSyntax(html) {
  // 移除v-开头的指令属性
  let filtered = html.replace(/v-[a-z-]+="[^"]*"/gi, '');
  
  // 移除{{ }}插值表达式
  filtered = filtered.replace(/\{\{[^}]+\}\}/gi, '');

  // 将ql-align类名替换为align
  //filtered = filtered.replace(/ql-align-([a-z]+)/gi, 'align-$1');
  
  // 移除Vue组件标签（假设组件标签包含连字符）
  filtered = filtered.replace(/<\/?[a-z-]+[^>]*>/gi, (match) => {
    // 保留基础HTML标签，移除自定义组件标签
    const basicTags = /<\/?(div|p|span|a|img|h[1-6]|ul|li|ol|strong|em|u|br|table|tr|td|th|tbody|thead|tfoot|blockquote|code)/i;
    return basicTags.test(match) ? match : '';
  });
  
  // 可以根据需要添加更多过滤规则
  
  return filtered;
}

defineExpose({
  openUpdateModal,
});
</script>