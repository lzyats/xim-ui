<template>
  <div class="container">
    <a-image class="img-prev" :style="{ display: 'none' }" :preview="{
      visible,
      onVisibleChange: setVisible,
    }" :src="previewUrl" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { fileApi } from '/@/components/file/index-api';
import { SmartLoading } from '/@/components/framework/smart-loading';

const imgFileType = ['jpg', 'jpeg', 'png', 'gif'];
const previewUrl = ref();

function showPreview(fileItem) {
  if (!fileItem.fileUrl) {
    (async () => {
      SmartLoading.show();
      let res = await fileApi.getUrl(fileItem.fileKey);
      fileItem.fileUrl = res.data;
      showFile(fileItem);
    })();
  } else {
    showFile(fileItem);
  }
}

const visible = ref(false);
const setVisible = (value) => {
  visible.value = value;
};

function showFile(fileItem) {
  if (isImg(fileItem.fileType)) {
    previewUrl.value = fileItem.fileUrl;
    setVisible(true);
    return;
  }
  fileApi.downLoadFile(fileItem.fileKey);
}

// 判断图片类型
function isImg(fileType) {
  return imgFileType.includes(fileType);
}

defineExpose({
  showPreview,
});
</script>

<style lang="less" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
