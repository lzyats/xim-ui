<template>
  <a-card size="small" :bordered="false" :hoverable="true">
    <a-collapse v-model:activeKey="activeKey" :bordered="false" style="background: rgb(255, 255, 255)">
      <template #expandIcon="{ isActive }">
        <caret-right-outlined :rotate="isActive ? 90 : 0" />
      </template>
      <a-collapse-panel v-for="(panel, index) in panels" :key="index" :header="panel.title" :style="customStyle"
        @click="togglePanel(index)">
        <div v-html="panel.content" style="padding-left: 25px"></div>
      </a-collapse-panel>
    </a-collapse>
  </a-card>
</template>

<script lang="ts" setup>
import { CaretRightOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';

const activeKey = ref<string[]>([]);
const lastActiveIndex = ref<number | null>(null); // 新增变量记录最后激活的面板索引
const customStyle = 'border-radius: 4px; border: 0; overflow: hidden;';
const panels = [
  {
    title: '1、浏览器没有语音播报？',
    content: 'a、如果使用的是【谷歌浏览器】<br>'
      + '请先在【浏览器地址栏】中输入【chrome://settings/content/sound】<br>'
      + '然后在【允许播放声音】选项中【添加】加入【当前域名】，如【www.baidu.com】<br><br>'
      + 'b、如果使用的是【其他浏览器】<br>'
      + '请直接【升级浏览器】到【最新版本】'
  },
  {
    title: '2、权限不足，请联系管理员？',
    content: '请直接【F5】刷新当前浏览器'
  },
];

function togglePanel(index: number) {
  if (lastActiveIndex.value === index) {
    activeKey.value = [];
    lastActiveIndex.value = null;
  } else {
    activeKey.value = [index.toString()];
    lastActiveIndex.value = index;
  }
}
</script>