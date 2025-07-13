<template>
  <div>
    <a-drawer title="聊天信息" :width="800" :open="visible" :body-style="{ paddingBottom: '80px' }" @close="onClose">
      <div class="chatList">
        <ul>
          <template v-for="(item, index) in list">
            <!-- 左侧 -->
            <li v-if="item.type == 1" :key="index">
              <div class="left">
                <img :src="item.portrait" alt="" />
              </div>
              <div class="right">
                <p class="time">
                  <span style="color: red" v-if="item.title">{{ item.title }}|</span>{{ item.nickname }}
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
                  <ChatForward :data="item.content">
                  </ChatForward>
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
                    :remark="item.content.remark">
                  </ChatPacket>
                </p>
                <p class="content" v-if="item.msgType == 'group_packet'">
                  <ChatPacket :data="item.content.data" dataType="普通红包" :count="item.content.count"
                    :remark="item.content.remark">
                  </ChatPacket>
                </p>
                <!-- 名片 -->
                <p class="content" v-if="item.msgType == 'card'">
                  <ChatCard :nickname="item.content.nickname" :portrait="item.content.portrait"
                    :userNo="item.content.userNo"></ChatCard>
                </p>

                <!-- 引用 -->
                <p class="content" v-if="item.msgType == 'reply'">
                  {{ item.content.data }}
                  <ChatReply :data="item.content"></ChatReply>
                </p>

                <!-- 音视频 -->
                <p class="content" v-if="item.msgType == 'call'">
                  <chat-call :type=item.content.callType :status=item.content.callStatus
                    :duration=item.content.callTime />
                </p>


                <p class="time">{{ item.createTime }}</p>
              </div>
            </li>
            <!-- 右侧 -->
            <li class="r" v-if="item.type == 2" :key="index">
              <div class="right">
                <p class="time">
                  {{ item.nickname }}<span style="color: red" v-if="item.title">|{{ item.title }}</span>
                </p>
                <p class="time">{{ item.userNo }}</p>
                <!-- 消息 -->
                <p class="content" v-if="item.msgType == 'text'" style="text-align: right;border-radius: 8px">
                  {{ item.content.data }}
                </p>
                <!-- 图片 -->
                <p class="content" v-if="item.msgType == 'image'">
                  <a-image :width="100" :src="item.content.data" />
                </p>
                <!-- 视频 -->
                <p class="content" v-if="item.msgType == 'video'">
                  <ChatVideo :src="item.content.data"></ChatVideo>
                </p>
                <!-- 聊天消息 -->
                <p class="content" v-if="item.msgType == 'forward'">
                  <ChatForward :data="item.content">
                  </ChatForward>
                </p>
                <!-- 位置 -->
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
                    :remark="item.content.remark"></ChatPacket>
                </p>
                <p class="content" v-if="item.msgType == 'group_packet'">
                  <ChatPacket :data="item.content.data" dataType="普通红包" :count="item.content.count"
                    :remark="item.content.remark"></ChatPacket>
                </p>
                <!-- 名片 -->
                <p class="content" v-if="item.msgType == 'card'">
                  <ChatCard :nickname="item.content.nickname" :portrait="item.content.portrait"
                    :userNo="item.content.userNo"></ChatCard>
                </p>
                <!-- 文件 -->
                <p class="content" v-if="item.msgType == 'file'">
                  <ChatFile :data="item.content.data" :title="item.content.title" :size="item.content.size"></ChatFile>
                </p>
                <p class="content" v-if="item.msgType == 'voice'">
                  <ChatVoice :audio="item.content.data"></ChatVoice>
                </p>
                <!-- 引用 -->
                <p class="content" v-if="item.msgType == 'reply'">
                  {{ item.content.data }}
                  <ChatReply :data="item.content"></ChatReply>
                </p>
                <!-- 音视频 -->
                <p class="content" v-if="item.msgType == 'call'">
                  <chat-call :type=item.content.callType :status=item.content.callStatus
                    :duration=item.content.callTime />
                </p>

                <p class="time">{{ item.createTime }}</p>
              </div>
              <div class="left">
                <img :src="item.portrait" alt="" />
              </div>
            </li>
          </template>
        </ul>
      </div>
      <div class="smart-query-table-page">
        <a-pagination showSizeChanger showQuickJumper show-less-items :pageSizeOptions="PAGE_SIZE_OPTIONS"
          :defaultPageSize="queryForm.pageSize" v-model:current="queryForm.pageNum"
          v-model:pageSize="queryForm.pageSize" :total="total" @change="queryViewRecord"
          @showSizeChange="queryViewRecord" :show-total="(total) => `共${total}条`" />
      </div>
    </a-drawer>
  </div>
</template>
<script setup>
import { reactive, ref, watch } from 'vue';
import { chatUserApi } from '/@/api/chat/chat-user-api';
import { PAGE_SIZE_OPTIONS } from '/@/constants/common-const';

import ChatPacket from '/@/components/chat/chat-packet.vue';
import ChatTransfer from '/@/components/chat/chat-transfer.vue';
import ChatCard from '/@/components/chat/chat-user-card.vue';
import ChatVoice from '/@/components/chat/chat-voice.vue';
import ChatVideo from '/@/components/chat/chat-video.vue';

import ChatFile from '/@/components/chat/chat-file.vue';
import ChatForward from '/@/components/chat/chat-forward.vue';
import ChatReply from '/@/components/chat/chat-reply.vue';
import ChatCall from '/@/components/chat/chat-call.vue';

const props = defineProps({
  userId: {
    type: [Number, String],
  },
  groupId: {
    type: [Number, String],
  },
});

const defaultQueryForm = {
  pageNum: 1,
  pageSize: 10,
};

const queryForm = reactive({ ...defaultQueryForm });

defineExpose({
  showDrawer,
});

const list = ref([]);
const total = ref(0);
const visible = ref(false);

const chatuser = ref();

async function queryViewRecord() {
  try {
    visible.value = true;
    const queryResult = await chatUserApi.queryUserMessage(chatuser.value.groupId, queryForm);
    list.value = queryResult.rows.map((item) => {
      return {
        type: item.userId == chatuser.value.userId ? '2' : '1',
        userNo: item.userNo,
        portrait: item.portrait,
        nickname: item.nickname,
        msgType: item.msgType,
        content: item.content,
        title: item.title,
        createTime: item.createTime,
      };
    });
    total.value = queryResult.total;
  } catch (err) {
    console.error('Failed to fetch user friend data:', err);
  } finally {
  }
}

// 点击查询
function showDrawer(chatUser) {
  chatuser.value = chatUser;
  queryForm.pageNum = 1;
  queryViewRecord();
}

// 监听分页事件
function onPageChange(currentPage, pageSize) {
  queryForm.pageNum = currentPage;
  queryForm.pageSize = pageSize;
}

// 在 `queryForm` 发生变化时重新请求数据
watch(queryForm, () => { }, { deep: true });

// 初始化时加载数据

function onClose() {
  visible.value = false;
}
// 绑定分页事件处理器
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
        text-align: right;
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