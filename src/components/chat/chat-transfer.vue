<template>
  <div class="red-packet">
    <div class="envelope">
      <div class="envelope-icon">
      </div>
      <div class="icon-text">

        <span v-if="remark">{{ remark }}</span>
        <span v-else> 我发起了一笔转账 </span>
      </div>
    </div>
    <div class="content">
      <div class="amount">转账金额：{{ data }}</div>
    </div>
    <div class="footer">{{ dataType }}</div>
  </div>
</template>
<script>
export default {
  name: "Transfer",
  props: {
    data: {
      type: Number
    },
    dataType: {
      type: String
    },
    remark: {
      type: String
    },
  },
  data() {
    return {

    };
  },
};
</script>
<style scoped>
.red-packet {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 200px;
}

.envelope {
  width: 100%;
  height: 50px;
  background-color: #f8dd0c;
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  /* 调整为 flex-start 以使内容靠左 */
}

.icon-text {
  text-align: center;
  width: 100%;
  /* 使文字占满整个容器 */
  white-space: nowrap;
  /* 防止文字换行 */
  overflow: hidden;
  /* 隐藏超出的文字 */
  text-overflow: ellipsis;
  /* 显示省略号 */
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8px;
}

.amount {
  font-size: 12px;
  color: #666;
}

.footer {
  text-align: left !important;
  font-size: 14px;
  font-weight: bold;
  color: #666;
  margin-top: 6px;
  margin-bottom: 3px;
}
</style>