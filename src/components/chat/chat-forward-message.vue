<template>
  <div>
    <a-drawer title="聊天信息" :width="800" :open="visible" :body-style="{ paddingBottom: '80px' }" @close="onClose">
      <div class="chatList">
        <ul>
          <template v-for="(item, index) in list" :key="index">
            <!-- 左侧 -->
            <li>
              <div class="left">
                <img :src="item.source.portrait" alt="" />
              </div>
              <div class="right">
                <p class="time">
                  {{ item.source.nickname }}
                </p>
                <p class="time">{{ item.userNo }}</p>
                <!-- 消息 -->
                <p class="content" v-if="item.msgType == 'text'" style="border-radius: 8px">
                  {{ item.content.data }}
                </p>
                <p class="content" v-if="item.msgType == 'voice'">
                  <ChatVoice :audio="item.content.data"></ChatVoice>
                </p>
                <!-- 视频 -->
                <p class="content" v-if="item.msgType == 'video'">
                  <ChatVideo :src="item.content.data"></ChatVideo>
                </p>
                <!-- 图片 -->
                <p class="content" v-if="item.msgType == 'image'">
                  <a-image :width="100" :src="item.content.data" />
                </p>

                <!-- 聊天消息 -->
                <p class="content" v-if="item.msgType == 'forward'">
                  <ChatForward :data="item.content"></ChatForward>
                </p>
                <!-- 文件 -->
                <p class="content" v-if="item.msgType == 'file'">
                  <ChatFile :data="item.content.data" :title="item.content.title" :size="item.content.size"></ChatFile>
                </p>
                <p class="content" style="text-align: center" v-if="item.msgType == 'location'">
                  <a-image :width="100" :src="item.content.thumbnail" />
                  <br />
                  {{ item.content.title }}
                  <br />
                  {{ item.content.address }}
                </p>
                <p class="content" v-if="item.msgType == 'transfer'">
                  <ChatTransfer :data="item.content.data" dataType="个人转账" :remark="item.content.remark"></ChatTransfer>
                </p>
                <p class="content" v-if="item.msgType == 'group_transfer'">
                  <ChatTransfer :data="item.content.data" dataType="群内转账" :remark="item.content.remark"></ChatTransfer>
                </p>
                <p class="content" v-if="item.msgType == 'packet'">
                  <ChatPacket :data="item.content.data" dataType="个人红包" :remark="item.content.remark"></ChatPacket>
                </p>
                <p class="content" v-if="item.msgType == 'group_assign'">
                  <ChatPacket :data="item.content.data" dataType="专属红包" :remark="item.content.remark"></ChatPacket>
                </p>
                <p class="content" v-if="item.msgType == 'group_luck'">
                  <ChatPacket :data="item.content.data" :count="item.content.count" dataType="拼手气红包"
                    :remark="item.content.remark"> </ChatPacket>
                </p>
                <p class="content" v-if="item.msgType == 'group_packet'">
                  <ChatPacket :data="item.content.data" dataType="普通红包" :count="item.content.count"
                    :remark="item.content.remark"> </ChatPacket>
                </p>
                <!-- 名片 -->
                <p class="content" v-if="item.msgType == 'card'">
                  <ChatCard :nickname="item.content.nickname" :portrait="item.content.portrait"
                    :userNo="item.content.userNo"></ChatCard>
                </p>
                <p class="time">{{ formattedCreateTime(item.createTime) }}</p>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </a-drawer>
  </div>
</template>
<script setup>
import { ref } from 'vue';

import ChatPacket from '/@/components/chat/chat-packet.vue';
import ChatTransfer from '/@/components/chat/chat-transfer.vue';
import ChatCard from '/@/components/chat/chat-user-card.vue';
import ChatVoice from '/@/components/chat/chat-voice.vue';
import ChatVideo from '/@/components/chat/chat-video.vue';
import ChatFile from '/@/components/chat/chat-file.vue';
import ChatForward from '/@/components/chat/chat-forward.vue';

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

defineExpose({
  showDrawer,
});

const list = ref([]);
const visible = ref(false);
// 点击查询
function showDrawer() {
  visible.value = true;
  list.value = props.data.content;
}
function onClose() {
  visible.value = false;
}
// 计算属性，格式化时间戳
const formattedCreateTime = (timestamp) => {
  // 将字符串转换为数字
  const numericTimestamp = Number(timestamp);
  // 检查转换后的值是否为有效数字
  if (isNaN(numericTimestamp)) {
    return '无效时间戳';
  }
  const date = new Date(numericTimestamp);
  if (isNaN(date.getTime())) {
    return '无效日期';
  }
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(
    date.getHours()
  ).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
};
</script>
<style lang="scss" scoped>
.drawer-content {
  height: calc(100vh - 100px);
  /* 设置固定高度 */
  overflow: hidden;
  /* 隐藏溢出内容 */
}

.drawer-scrollable {
  height: 100%;
  /* 占据整个容器的高度 */
  overflow-y: auto;
  /* 添加垂直滚动条 */
  padding: 16px;
  /* 内边距 */
}

.chatList {
  ul {
    padding: 10px;
    box-sizing: border-box;

    li {
      display: flex;
      margin-bottom: 40px;

      .left {
        width: 50px;
        height: 50px;
        margin-right: 16px;

        img {
          width: 100%;
          height: 100%;
          border-radius: 25%;
        }
      }

      .right {
        flex: 1;

        p {
          margin: 0;
        }

        p.time {
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 4px;
        }

        p.content {
          font-size: 14px;
          padding-top: 12px;
          padding-bottom: 12px;
          border-radius: 12px;
          color: black;
          display: inline-block;
          word-break: break-word;
          /* 允许单词内的换行 */
          white-space: normal;
          /* 允许正常的换行 */
        }
      }
    }

    li.r {
      p.time {
        text-align: right;
      }

      p.content {
        text-align: left;
      }

      .left {
        margin-left: 10px;
        margin-right: 0;
      }

      .right {
        text-align: right;
      }
    }
  }
}
</style>