<template>
  <div class="business-card">
    <div class="avatar-info">
      <div class="avatar">
        <img :src="portrait" alt="Avatar">
      </div>
      <div class="info">
        <div class="phone">{{ nickname }}</div>
        <div class="id">{{ userNo }}</div>
      </div>
    </div>
    <div class="footer">推荐名片</div>
  </div>
</template>

<script>
export default {
  name: "Usercard",
  props: {
    portrait: {
      type: String,
    },
    nickname: {
      type: String,
    },
    userNo: {
      type: String,
    },
  },
  data() {
    return {};
  },
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
  width: 80px;
  height: 80px;
  border-radius: 10%;
  overflow: hidden;
  margin-right: 12px;
  /* 添加间距 */
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /* 对齐到左侧 */
}

.phone {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  font-weight: bold;
}

.id {
  font-size: 14px;
  color: #666;
  font-weight: bold;
}

.footer {
  font-size: 16px;
  color: #666;
  margin-top: 8px;
  margin-bottom: 3px;
  font-weight: bold;
  text-align: center;
  /* 居中显示 */
}
</style>