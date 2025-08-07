<template>
  <a-card size="small" :bordered="false" :hoverable="true">

    <!---------- 表格操作行 begin ----------->
    <a-row class="smart-table-btn-block">
      <div class="smart-table-operate-block">
        <a-button type="primary" v-privilege="'chat:user:edit'" @click="setRemark(chatUser.remark)">修改备注</a-button>
        <span v-if="chatUser.remark">备注：{{ chatUser.remark }}</span>
      </div>
      <div class="smart-table-setting-block">
        <TableOperator :refresh="queryInfo" />
      </div>
    </a-row>
    <!---------- 表格操作行 end ----------->

    <a-card title="基本信息" size="small">

      <a-row :gutter="16">
        <a-col :span="3">
          <p style="text-align: center">
            <a-image :width="80" :height="80" :src="chatUser.portrait" style="border-radius: 10px;" />
          </p>
        </a-col>
        <a-col :span="16">
          <a-descriptions :column="2" size="small">
            <a-descriptions-item label="用户昵称">{{ chatUser.nickname }}</a-descriptions-item>
            <a-descriptions-item label="账户余额">
              <a-tag color="success">¥ {{ chatUser.balance }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="用户编号">{{ chatUser.userNo }}</a-descriptions-item>
            <a-descriptions-item label="注册邮箱">{{ chatUser.email }}</a-descriptions-item>
            <a-descriptions-item label="手机号码">{{ chatUser.phone }}</a-descriptions-item>
            <a-descriptions-item label="注册时间">{{ chatUser.createTime }}</a-descriptions-item>
          </a-descriptions>
        </a-col>
      </a-row>
    </a-card>

    <a-card title="状态信息" size="small" style="margin-top: 15px">
      <a-descriptions :column="2" size="small">
        <a-descriptions-item label="账号状态">
          <a-tag v-if="chatUser.status == 'Y'" color="success">正常</a-tag>
          <a-tag v-if="chatUser.status == 'N'" color="error">注销</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="封禁状态">
          <a-tag v-if="chatUser.banned == 'N'" color="success">正常</a-tag>
          <a-tag v-if="chatUser.banned == 'Y'" color="error">封禁</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="实名状态">
          <a-tag v-if="chatUser.auth == '0'" color="magenta">未认证</a-tag>
          <a-tag v-if="chatUser.auth == '1'" color="warning">认证中</a-tag>
          <a-tag v-if="chatUser.auth == '2'" color="success">已认证</a-tag>
          <a-tag v-if="chatUser.auth == '3'" color="error">已拒绝</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="测试账号">
          <a-tag v-if="chatUser.special == 'N'" color="success">正常</a-tag>
          <a-tag v-if="chatUser.special == 'Y'" color="error">测试</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="封禁时间" v-if="chatUser.banned == 'Y'">
          {{ chatUser.bannedTime }}
        </a-descriptions-item>
        <a-descriptions-item label="封禁原因" v-if="chatUser.banned == 'Y'">
          {{ chatUser.bannedReason }}
        </a-descriptions-item>
        <a-descriptions-item label="内部账号">
          <a-tag v-if="chatUser.isvip == '0'" color="magenta">普通账号</a-tag>
          <a-tag v-if="chatUser.isvip == '1'" color="success">内部账号</a-tag>
          <a-tag v-if="chatUser.isvip == '2'" color="warning">SVIP</a-tag>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <a-card title="登录信息" size="small" style="margin-top: 15px">
      <a-descriptions :column="2" size="small">
        <a-descriptions-item label="登录地址">{{ chatUser.ip }}</a-descriptions-item>
        <a-descriptions-item label="登录时间">{{ chatUser.onLine }}</a-descriptions-item>
        <a-descriptions-item label="登录地址">{{ chatUser.ipAddr }}</a-descriptions-item>
      </a-descriptions>
    </a-card>

    <a-card title="基本操作" size="small" style="margin-top: 15px">
      <a-row :gutter="16">
        <a-col v-privilege="'chat:user:wallet'">
          <a-button type="primary" @click="recharge">账号充值</a-button>
        </a-col>
        <a-col v-privilege="'chat:user:auth'" v-if="chatUser.auth == '2'">
          <a-button type="primary" @click="cancelAuth">解除实名</a-button>
        </a-col>
        <a-col v-privilege="'chat:user:edit'">
          <a-button type="primary" @click="resetPwd">登录密码</a-button>
        </a-col>
        <a-col v-privilege="'chat:user:edit'">
          <a-button type="primary" @click="resetPay">支付密码</a-button>
        </a-col>
        <a-col v-privilege="'chat:user:edit'">
          <a-button type="primary" @click="email">修改邮箱</a-button>
        </a-col>
      </a-row>
    </a-card>

    <a-card title="关键操作" size="small" style="margin-top: 15px">
      <a-row :gutter="16">
        <a-col v-privilege="'chat:user:deleted'" v-if="chatUser.status == 'Y'">
          <a-button type="primary" @click="deleted">注销用户</a-button>
        </a-col>
        <a-col v-privilege="'chat:user:edit'">
          <a-button type="primary" @click="special">
            <template v-if="chatUser.special == 'Y'">正常账号</template>
            <template v-else>测试账号</template>
          </a-button>
        </a-col>
        <a-col v-privilege="'chat:user:edit'">
          <a-button type="primary" @click="speciala">
            <template v-if="chatUser.isvip == 1">普通账号</template>
            <template v-if="chatUser.isvip == 0">内部账号</template>
          </a-button>
        </a-col>
        <a-col v-privilege="'chat:user:banned'">
          <a-button type="primary" @click="cancelBanned" v-if="chatUser.banned == 'Y'">
            解封用户
          </a-button>
          <a-button type="primary" @click="bannedUser" v-if="chatUser.banned == 'N'">
            封禁用户
          </a-button>
        </a-col>
      </a-row>
    </a-card>

    <a-card title="关联操作" size="small" style="margin-top: 15px" v-if="userId">
      <a-tabs v-model:activeKey="activeKey" size="small">
        <a-tab-pane :key="1" tab="认证信息" v-if="privilege('chat:user:auth')">
          <AuthRef ref="authRef" :userId="userId" :key="userId" />
        </a-tab-pane>
        <a-tab-pane :key="2" tab="好友信息" v-if="privilege('chat:user:friend')">
          <FriendRef ref="friendRef" :userId="userId" :key="userId" />
        </a-tab-pane>
        <a-tab-pane :key="3" tab="群组信息" v-if="privilege('chat:user:group')">
          <GroupRef ref="groupRef" :userId="userId" :key="userId" />
        </a-tab-pane>
        <a-tab-pane :key="4" tab="操作日志" v-if="privilege('chat:user:log')">
          <LogsRef ref="logsRef" :userId="userId" :key="userId" />
        </a-tab-pane>
        <a-tab-pane :key="5" tab="收支明细" v-if="privilege('chat:user:wallet')">
          <IncomeRef ref="incomeRef" :userId="userId" :key="userId" />
        </a-tab-pane>
        <a-tab-pane :key="6" tab="关联地址" v-if="privilege('chat:user:ip')">
          <IpRef ref="ipRef" :userId="userId" :key="userId" />
        </a-tab-pane>
        <a-tab-pane :key="7" tab="关联实名" v-if="privilege('chat:user:auth')">
          <AutherRef ref="autherRef" :userId="userId" :key="userId" />
        </a-tab-pane>
        <a-tab-pane :key="8" tab="关联邮箱" v-if="privilege('chat:user:email')">
          <MailboxRef ref="mailboxRef" :userId="userId" :key="userId" />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-card>

  <!-- 封禁 -->
  <BannedRef ref="bannedRef" @reloadList="queryInfo" />
  <!-- 邮箱 -->
  <EmailRef ref="emailRef" @reloadList="queryInfo" />
  <!-- 备注 -->
  <RemarkRef ref="remarkRef" @reloadList="queryInfo" />
  <!-- 充值 -->
  <RechargeRef ref="rechargeRef" @reloadList="queryInfo" />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { message, Modal } from 'ant-design-vue';
import AuthRef from './index-auth.vue';
import BannedRef from './index-banned.vue';
import RechargeRef from './index-recharge.vue';
import EmailRef from './index-email.vue';
import RemarkRef from './index-remark.vue';
import FriendRef from './index-friend.vue';
import GroupRef from './index-group.vue';
import IpRef from './index-ip.vue';
import AutherRef from './index-auther.vue';
import MailboxRef from './index-mailbox.vue';
import { chatUserApi } from '/@/api/chat/chat-user-api';
import { privilege } from '/@/lib/privilege-plugin';
import { SmartLoading } from '/@/components/framework/smart-loading';
import LogsRef from './index-logs.vue';
import IncomeRef from './index-income.vue';
import { useRoute } from 'vue-router';
import { TableOperator, TABLE_ID, PAGE_SIZE_OPTIONS } from '/@/components/table-operator';

const activeKey = ref(1);
const authRef = ref();
const friendRef = ref();
const logsRef = ref();
const incomeRef = ref();
const ipRef = ref();
const autherRef = ref();
const groupRef = ref();
const chatUser = ref({});

const userId = ref();

const route = useRoute();

onMounted(() => {
  userId.value = route.name;
  console.log(route.name);
  queryInfo();
});

// 查询详情
async function queryInfo() {
  SmartLoading.show();
  const result = await chatUserApi.queryInfo(userId.value);
  chatUser.value = result.data;
}

// 注销用户
function deleted() {
  Modal.confirm({
    title: '提示',
    content: '确认注销当前用户吗?',
    async onOk() {
      await chatUserApi.deletedUser(userId.value);
      message.success('注销成功');
      queryInfo();
    },
  });
}

// 重置密码
function resetPwd() {
  Modal.confirm({
    title: '提示',
    content: '确认重置当前[登录密码]吗?',
    async onOk() {
      let res = await chatUserApi.resetPwd(userId.value);
      message.success(res.data.data);
    },
  });
}

// 重置密码
function resetPay() {
  Modal.confirm({
    title: '提示',
    content: '确认重置当前[支付密码]吗?',
    async onOk() {
      let res = await chatUserApi.resetPay(userId.value);
      message.success(res.data.data);
    },
  });
}

// 解除认证
function cancelAuth() {
  Modal.confirm({
    title: '提示',
    content: '确认解除实名认证吗?',
    async onOk() {
      await chatUserApi.cancelAuth(userId.value);
      message.success('解除实名认证成功');
      queryInfo();
    },
  });
}

// 封禁用户
const bannedRef = ref();

// 封禁用户
function bannedUser() {
  bannedRef.value.showDrawer(userId.value);
}

// 解封用户
function cancelBanned() {
  Modal.confirm({
    title: '提示',
    content: '确认解封当前用户吗?',
    async onOk() {
      const formData = {
        userId: userId.value,
        bannedTime: 0,
      };
      await chatUserApi.bannedUser(formData);
      message.success('解封成功');
      queryInfo();
    },
  });
}

// 测试账号
function special() {
  const label = chatUser.value.special === 'Y' ? '正常账号' : '测试账号';
  Modal.confirm({
    title: '提示',
    content: '确认修改为[' + label + ']吗?',
    async onOk() {
      const formData = {
        userId: userId.value,
        special: chatUser.value.special === 'Y' ? 'N' : 'Y',
      };
      await chatUserApi.updateSpecial(formData);
      message.success('修改成功');
      queryInfo();
    },
  });
}

// 内部账号
function speciala() {
  const label = chatUser.value.isvip === 0 ? '内部账号' : '普通账号';
  Modal.confirm({
    title: '提示',
    content: '确认修改为[' + label + ']吗?',
    async onOk() {
      const formData = {
        userId: userId.value,
        isvip: chatUser.value.isvip === 0 ? 1 : 0,
      };
      await chatUserApi.updateIsvip(formData);
      message.success('修改成功');
      queryInfo();
    },
  });
}

/**
 * 充值
 */
const rechargeRef = ref();

function recharge() {
  rechargeRef.value.showModal(userId.value);
}

/**
 * 邮箱
 */
const emailRef = ref();

function email() {
  emailRef.value.showModal(userId.value);
}

/**
 * 备注
 */
const remarkRef = ref();

function setRemark(remark) {
  remarkRef.value.showModal(userId.value, remark);
}

</script>

<style lang="less" scoped>
:deep(.ant-descriptions-item-content) {
  flex: 1;
  overflow: hidden;
}
</style>