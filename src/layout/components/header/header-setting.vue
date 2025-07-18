<template>
  <a-drawer :title="$t('setting.title')" placement="right" :open="visible" @close="close">
    <a-form layout="horizontal" :label-col="{ span: 8 }">
      <a-form-item label="语言/Language">
        <a-select v-model:value="formState.language" @change="changeLanguage" style="width: 120px">
          <a-select-option v-for="item in i18nList" :key="item.value" :value="item.value">{{ item.text
            }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('setting.color')">
        <div class="color-container">
          <template v-for="(item, index) in themeColors">
            <div v-if="index === formState.colorIndex" class="color" :key="index">
              <CheckSquareFilled :style="{ color: item.primaryColor, fontSize: '22px' }" />
            </div>
            <div v-else @click="changeColor(index)" class="color" :key="item">
              <svg class="icon" viewBox="0 0 1024 1024" version="1.1" :fill="item.primaryColor"
                xmlns="http://www.w3.org/2000/svg" width="26" height="26">
                <path
                  d="M128 160.01219c0-17.67619 14.336-32.01219 32.01219-32.01219h704c17.65181 0 31.98781 14.336 31.98781 32.01219v704c0 17.65181-14.336 31.98781-32.01219 31.98781H160.036571a31.98781 31.98781 0 0 1-32.01219-32.01219V160.036571z">
                </path>
              </svg>
            </div>
          </template>
        </div>
      </a-form-item>
      <a-form-item :label="$t('setting.border.radius')">
        <a-slider v-model:value="formState.borderRadius" :min="0" :max="6" @change="changeBorderRadius" />
      </a-form-item>
      <a-form-item :label="$t('setting.menu.width')">
        <a-input-number @change="changeSideMenuWidth" v-model:value="formState.sideMenuWidth" :min="1" />
        像素（px）
      </a-form-item>
      <a-form-item :label="$t('setting.compact')">
        <a-radio-group v-model:value="formState.compactFlag" button-style="solid" @change="changeCompactFlag">
          <a-radio-button :value="false">默认</a-radio-button>
          <a-radio-button :value="true">紧凑</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label="$t('setting.menu.theme')">
        <a-radio-group v-model:value="formState.sideMenuTheme" button-style="solid" @change="changeMenuTheme">
          <a-radio-button value="dark">Dark</a-radio-button>
          <a-radio-button value="light">Light</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label="$t('setting.pagetag.style')">
        <a-radio-group v-model:value="formState.pageTagStyle" button-style="solid" @change="changePageTagStyle">
          <a-radio-button value="default">默认</a-radio-button>
          <a-radio-button value="antd">Ant Design</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label="$t('setting.pagetag')">
        <a-switch @change="changePageTagFlag" v-model:checked="formState.pageTagFlag" checked-children="显示"
          un-checked-children="隐藏" />
      </a-form-item>
      <a-form-item :label="$t('setting.bread')">
        <a-switch @change="changeBreadCrumbFlag" v-model:checked="formState.breadCrumbFlag" checked-children="显示"
          un-checked-children="隐藏" />
      </a-form-item>
      <a-form-item :label="$t('setting.footer')">
        <a-switch @change="changeFooterFlag" v-model:checked="formState.footerFlag" checked-children="显示"
          un-checked-children="隐藏" />
      </a-form-item>
      <a-form-item :label="$t('setting.watermark')">
        <a-switch @change="changeWatermarkFlag" v-model:checked="formState.watermarkFlag" checked-children="显示"
          un-checked-children="隐藏" />
      </a-form-item>
      <br />
      <br />
    </a-form>

    <div class="footer">
      <a-button style="margin-right: 8px" type="primary" @click="copy">复制配置信息</a-button>
      <a-button type="block" danger @click="reset">恢复默认配置 </a-button>
    </div>
  </a-drawer>
</template>
<script setup>
import { ref, reactive, h } from 'vue';
import { i18nList } from '/@/components/i18n/index';
import { useI18n } from 'vue-i18n';
import localStorageKeyConst from '/@/constants/local-storage-key-const';
import { localSave } from '/@/lib/local-util';
import { useAppConfigStore } from '/@/store/config';
import { Modal } from 'ant-design-vue';
import { appDefaultConfig } from '/@/config/app-config';
import { themeColors } from '/@/theme/color.js';

// ----------------- modal 显示与隐藏 -----------------

const visible = ref(false);
defineExpose({
  show,
});

function close() {
  visible.value = false;
}

function show() {
  visible.value = true;
}

// ----------------- 配置信息操作 -----------------
function copy() {
  let content = JSON.stringify(formState, null, 2);
  // 创建元素用于复制
  const aux = document.createElement('input');
  // 设置元素内容
  aux.setAttribute('value', content);
  // 将元素插入页面进行调用
  document.body.appendChild(aux);
  // 复制内容
  aux.select();
  // 将内容复制到剪贴板
  document.execCommand('copy');
  // 删除创建元素
  document.body.removeChild(aux);

  Modal.success({
    title: '复制成功',
    content: h('div', {}, [h('p', '可以直接修改 /@/config/app-config.js 文件保存此配置')]),
  });
}

function reset() {
  for (const k in appDefaultConfig) {
    formState[k] = appDefaultConfig[k];
  }
  appConfigStore.reset();
}

// ----------------- 表单数据实时保存到localstorage -----------------

const appConfigStore = useAppConfigStore();
useAppConfigStore().$subscribe((mutation, state) => {
  localSave(localStorageKeyConst.APP_CONFIG, JSON.stringify(state));
});

// ----------------- 表单 -----------------

let formValue = {
  // i18n 语言选择
  language: appConfigStore.language,
  // 布局: side 或者 side-expand
  layout: appConfigStore.layout,
  // 页面宽度
  pageWidth: appConfigStore.pageWidth,
  // 颜色
  colorIndex: appConfigStore.colorIndex,
  // 侧边菜单宽度
  sideMenuWidth: appConfigStore.sideMenuWidth,
  // 菜单主题
  sideMenuTheme: appConfigStore.sideMenuTheme,
  // 页面紧凑
  compactFlag: appConfigStore.compactFlag,
  // 页面圆角
  borderRadius: appConfigStore.borderRadius,
  // 标签页
  pageTagFlag: appConfigStore.pageTagFlag,
  // 标签页 样式
  pageTagStyle: appConfigStore.pageTagStyle,
  // 面包屑
  breadCrumbFlag: appConfigStore.breadCrumbFlag,
  // 页脚
  footerFlag: appConfigStore.footerFlag,
  // 水印
  watermarkFlag: appConfigStore.watermarkFlag,
};

let formState = reactive({ ...formValue });

const { locale } = useI18n();
function changeLanguage(languageValue) {
  locale.value = languageValue;
  appConfigStore.$patch({
    language: languageValue,
  });
}

function changeLayout(e) {
  appConfigStore.$patch({
    layout: e.target.value,
  });
}

function changeColor(index) {
  formState.colorIndex = index;
  appConfigStore.$patch({
    colorIndex: index,
  });
}

function changeSideMenuWidth(value) {
  appConfigStore.$patch({
    sideMenuWidth: value,
  });
}

function changePageWidth(e) {
  appConfigStore.$patch({
    pageWidth: e.target.value,
  });
}

function changeMenuTheme(e) {
  appConfigStore.$patch({
    sideMenuTheme: e.target.value,
  });
}

function changeCompactFlag(e) {
  appConfigStore.$patch({
    compactFlag: e.target.value,
  });
}
function changeBorderRadius(e) {
  appConfigStore.$patch({
    borderRadius: e,
  });
}

function changeBreadCrumbFlag(e) {
  appConfigStore.$patch({
    breadCrumbFlag: e,
  });
}

function changePageTagFlag(e) {
  appConfigStore.$patch({
    pageTagFlag: e,
  });
}

function changePageTagStyle(e) {
  appConfigStore.$patch({
    pageTagStyle: e.target.value,
  });
}

function changeFooterFlag(e) {
  appConfigStore.$patch({
    footerFlag: e,
  });
}

function changeWatermarkFlag(e) {
  appConfigStore.$patch({
    watermarkFlag: e,
  });
}
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

.color-container {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.color {
  margin-left: 8px;
  height: 26px;
  width: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
