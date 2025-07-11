<template>
  <div class="business-card">
    <div class="avatar-info">
      <div class="avatar">
        <img src="/@/assets/images/file/file.png" alt="Avatar" />
      </div>
      <div class="info">
        <div class="id">{{ title }}</div>
        <div class="phone">{{ fileSize }}</div>
      </div>
    </div>
    <div class="footer"><a @click="downloadFile(data,title)">下载</a></div>
    <!-- 下载地址 -->
  </div>
</template>

<script>
export default {
  name: 'Chatfile',
  props: {
    data: {
      type: String,
    },
    title: {
      type: String,
    },
    size: {
      type: Number,
    },
  },
  data() {
    return {
      fileSize: undefined,
    };
  },
  mounted() {
    this.fileSize = this.formatFileSize(this.$props.size);
  },

  methods: {
    formatFileSize(size) {
      if (size < 1024) {
        return `${size} B`;
      } else if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(2)} KB`;
      } else if (size < 1024 * 1024 * 1024) {
        return `${(size / (1024 * 1024)).toFixed(2)} MB`;
      } else {
        return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
      }
    },
    async downloadFile(data,title) {
      try {
        const response = await fetch(data); // API URL
        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = title; // 下载后保存的文件名
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('下载文件失败:', error);
      }
    }
  },

  // 格式化文件大小
};
</script>

<style scoped>
.business-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 250px;
  padding: 5px;
}

.avatar-info {
  display: flex;
  align-items: center;
  width: 100%;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 10%;
  overflow: hidden;
  margin-right: 12px;

  flex-shrink: 0; /* 防止图片容器被压缩 */
  /* 添加间距 */
}

.avatar img {
  width: 80%;
  height: 80%;
  object-fit: cover;
}

.info {
  display: flex;
  flex-direction: column;
  /* align-items: flex-start; */
  /* 对齐到左侧 */
}

.phone {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  font-weight: bold;
  text-align: center;
}

.id {
  font-size: 14px;
  color: #666;
  font-weight: bold;
  text-align: center;
}

.footer {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
  margin-bottom: 3px;
  font-weight: bold;
  text-align: center;
  /* 居中显示 */
}
</style>