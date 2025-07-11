<template>
  <a-card size="small" :bordered="false" :hoverable="true">

    <!---------- 表格操作行 begin ----------->
    <a-row class="smart-table-btn-block">
      <div class="smart-table-operate-block">
        <a-button v-privilege="'chat:group:edit'" type="primary" @click="groupSettings">
          群组设置
        </a-button>
      </div>
      <div class="smart-table-setting-block">
        <TableOperator :refresh="queryDetail" />
      </div>
    </a-row>
    <!---------- 表格操作行 end ----------->

    <a-card title="基本信息" size="small">
      <a-row :gutter="16">
        <a-col :span="3">
          <p style="text-align: center">
            <a-image :width="80" :height="80" :src="chatGroup.portrait" style="border-radius: 10px;" />
          </p>
        </a-col>
        <a-col :span="16">
          <a-descriptions :column="1" size="small">
            <a-descriptions-item label="群组名称">{{ chatGroup.groupName }}</a-descriptions-item>
            <a-descriptions-item label="群组编号">{{ chatGroup.groupNo }}</a-descriptions-item>
            <a-descriptions-item label="群组成员">{{ chatGroup.memberCount }}/{{ chatGroup.levelCount }}</a-descriptions-item>
          </a-descriptions>
        </a-col>
      </a-row>
    </a-card>

    <a-card title="状态信息" size="small" style="margin-top: 15px">
      <a-row :gutter="16">
        <a-col :span="16">
          <a-descriptions :column="3" size="small">
            <a-descriptions-item label="群组状态">
              <a-tag v-if="chatGroup.status == 'Y'" color="success">{{ chatGroup.statusLabel }}</a-tag>
              <a-tag v-if="chatGroup.status == 'N'" color="error">{{ chatGroup.statusLabel }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="封禁状态">
              <a-tag v-if="chatGroup.banned == 'Y'" color="error">{{ chatGroup.bannedLabel }}</a-tag>
              <a-tag v-if="chatGroup.banned == 'N'" color="success">{{ chatGroup.bannedLabel }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item></a-descriptions-item>
            <a-descriptions-item label="隐私编号">
              <a-tag v-if="chatGroup.privacyNo == 'Y'" color="success">开启</a-tag>
              <a-tag v-if="chatGroup.privacyNo == 'N'" color="error">关闭</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="隐私扫码">
              <a-tag v-if="chatGroup.privacyScan == 'Y'" color="success">开启</a-tag>
              <a-tag v-if="chatGroup.privacyScan == 'N'" color="error">关闭</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="隐私群名">
              <a-tag v-if="chatGroup.privacyName == 'Y'" color="success">开启</a-tag>
              <a-tag v-if="chatGroup.privacyName == 'N'" color="error">关闭</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="成员保护">
              <a-tag v-if="chatGroup.configMember == 'Y'" color="success">开启</a-tag>
              <a-tag v-if="chatGroup.configMember == 'N'" color="error">关闭</a-tag>
            </a-descriptions-item>

            <a-descriptions-item label="成员邀请">
              <a-tag v-if="chatGroup.configInvite == 'Y'" color="success">开启</a-tag>
              <a-tag v-if="chatGroup.configInvite == 'N'" color="error">关闭</a-tag>
            </a-descriptions-item>

            <a-descriptions-item label="全员禁言">
              <a-tag v-if="chatGroup.configSpeak == 'Y'" color="error">开启</a-tag>
              <a-tag v-if="chatGroup.configSpeak == 'N'" color="success">关闭</a-tag>
            </a-descriptions-item>

            <a-descriptions-item label="显示头衔">
              <a-tag v-if="chatGroup.configTitle == 'Y'" color="success">开启</a-tag>
              <a-tag v-if="chatGroup.configTitle == 'N'" color="error">关闭</a-tag>
            </a-descriptions-item>

            <a-descriptions-item label="进群审核">
              <a-tag v-if="chatGroup.configAudit == 'Y'" color="success">开启</a-tag>
              <a-tag v-if="chatGroup.configAudit == 'N'" color="error">关闭</a-tag>
            </a-descriptions-item>

            <a-descriptions-item label="发送资源">
              <a-tag v-if="chatGroup.configMedia == 'Y'" color="success">开启</a-tag>
              <a-tag v-if="chatGroup.configMedia == 'N'" color="error">关闭</a-tag>
            </a-descriptions-item>

            <a-descriptions-item label="专属可见">
              <a-tag v-if="chatGroup.configAssign == 'Y'" color="success">开启</a-tag>
              <a-tag v-if="chatGroup.configAssign == 'N'" color="error">关闭</a-tag>
            </a-descriptions-item>

            <a-descriptions-item label="修改昵称">
              <a-tag v-if="chatGroup.configNickname == 'Y'" color="success">开启</a-tag>
              <a-tag v-if="chatGroup.configNickname == 'N'" color="error">关闭</a-tag>
            </a-descriptions-item>

            <a-descriptions-item label="发二维码">
              <a-tag v-if="chatGroup.configScan == 'Y'" color="success">开启</a-tag>
              <a-tag v-if="chatGroup.configScan == 'N'" color="error">关闭</a-tag>
            </a-descriptions-item>

            <a-descriptions-item label="红包开关">
              <a-tag v-if="chatGroup.configPacket == 'Y'" color="success">开启</a-tag>
              <a-tag v-if="chatGroup.configPacket == 'N'" color="error">关闭</a-tag>
            </a-descriptions-item>

            <a-descriptions-item label="红包金额">
              <a-tag v-if="chatGroup.configAmount == 'Y'" color="success">显示</a-tag>
              <a-tag v-if="chatGroup.configAmount == 'N'" color="error">不显示</a-tag>
            </a-descriptions-item>

            <a-descriptions-item label="红包禁抢">
              <a-tag v-if="chatGroup.configReceive == 'Y'" color="error">开启</a-tag>
              <a-tag v-if="chatGroup.configReceive == 'N'" color="success">关闭</a-tag>
            </a-descriptions-item>

          </a-descriptions>
        </a-col>
      </a-row>
    </a-card>

    <a-card title="公告信息" size="small" style="margin-top: 15px">
      <a-row :gutter="16">
        <a-col :span="16">
          <a-descriptions :column="1" size="small">
            <a-descriptions-item label="公告开关">
              <a-tag v-if="chatGroup.noticeTop == 'Y'" color="success">开启</a-tag>
              <a-tag v-if="chatGroup.noticeTop == 'N'" color="error">关闭</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="公告内容">{{ chatGroup.notice }}</a-descriptions-item>
          </a-descriptions>
        </a-col>
      </a-row>
    </a-card>

    <a-card title="基本操作" size="small" style="margin-top: 15px">
      <a-row :gutter="16">
        <a-col v-privilege="'chat:group:banned'">
          <a-button type="primary" @click="handleBanned('N')" v-if="chatGroup.banned == 'Y'">
            解封群组
          </a-button>
          <a-button type="primary" @click="handleBanned('Y')" v-if="chatGroup.banned == 'N'">
            封禁群组
          </a-button>
        </a-col>
      </a-row>
    </a-card>

    <a-card title="关联操作" size="small" style="margin-top: 15px">
      <a-tabs v-model:activeKey="activeKey" size="small" v-if="chatGroup.groupId">
        <a-tab-pane :key="1" tab="群组成员">
          <MemberRef ref="memberRef" :groupId="groupId" :key="groupId" />
        </a-tab-pane>
        <a-tab-pane :key="2" tab="操作日志" v-if="privilege('chat:group:log')">
          <LogsRef ref="logsRef" :groupId="groupId" :key="groupId" />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-card>
  <!-- 封禁 -->
  <SettingRef ref="settingRef" @reloadList="queryDetail" />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { message, Modal } from 'ant-design-vue';
import MemberRef from './index-member.vue';
import { chatGroupApi } from '/@/api/chat/chat-group-api';
import { privilege } from '/@/lib/privilege-plugin';
import { SmartLoading } from '/@/components/framework/smart-loading';
import LogsRef from './index-logs.vue';
import SettingRef from './index-setting.vue';
import { useRoute } from 'vue-router';
import { TableOperator, TABLE_ID, PAGE_SIZE_OPTIONS } from '/@/components/table-operator';

const props = defineProps({
  newsType: {
    type: Number,
  },
});

const activeKey = ref(1);

const settingRef = ref();

const memberRef = ref();

const logsRef = ref();

const chatGroup = ref({});

const groupId = ref();

const route = useRoute();

onMounted(() => {
  groupId.value = route.name;
  queryDetail();
});

// 查询详情
async function queryDetail() {
  SmartLoading.show();
  const result = await chatGroupApi.queryDetail(groupId.value);
  chatGroup.value = result.data;
}

// 封禁
function handleBanned(banned) {
  const label = banned == 'Y' ? '封禁' : '解封';
  Modal.confirm({
    title: '提示',
    content: '确认[' + label + ']当前群组吗?',
    onOk() {
      bannedGroup(banned);
    },
  });
}

// 修改群组信息
function groupSettings() {
  settingRef.value.showDrawer(chatGroup.value);
}
// 封禁和解封API
async function bannedGroup(banned) {
  try {
    const formData = {
      groupId: chatGroup.value.groupId,
      banned: banned,
    };
    await chatGroupApi.bannedGroup(formData);
    message.success(banned == "Y" ? '封禁成功' : '解封成功');
    queryDetail();
  } finally {
    tableLoading.value = false;
  }
}

</script>

<style lang="less" scoped>
:deep(.ant-descriptions-item-content) {
  flex: 1;
  overflow: hidden;
}
</style>