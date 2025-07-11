<!--
  * 登录
-->
<template>
  <div class="login-container">
    <div class="box-item desc">
      <div class="welcome">
        <p>欢迎登录</p>
      </div>
      <img class="welcome-img" :src="leftBg2" />
    </div>
    <div class="box-item login">
      <div class="login-title">账号登录</div>
      <a-form ref="formRef" class="login-form" :model="loginForm" :rules="rules">
        <a-form-item name="username">
          <a-input v-model:value.trim="loginForm.username" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item name="password">
          <a-input-password v-model:value="loginForm.password" autocomplete="on"
            :type="showPassword ? 'text' : 'password'" placeholder="请输入密码" />
        </a-form-item>
        <a-form-item name="code">
          <a-input class="captcha-input" v-model:value.trim="loginForm.code" placeholder="请输入验证码" />
          <img class="captcha-img" :src="img" @click="getCaptcha" />
        </a-form-item>
        <a-form-item>
          <div class="btn" @click="onLogin">登录</div>
        </a-form-item>
        <a-form-item v-if="mode === 'test'">
          测试账号：admin 测试密码：admin
        </a-form-item>
      </a-form>

    </div>
  </div>
</template>
<script setup>
import { message } from 'ant-design-vue';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { loginApi } from '/@/api/login/login-api';
import { SmartLoading } from '/@/components/framework/smart-loading';
import loginQR from '/@/assets/images/login/login-qr.png';
import leftBg2 from '/@/assets/images/login/left-bg2.png';
import wechatIcon from '/@/assets/images/login/wechat-icon.png';
import aliIcon from '/@/assets/images/login/ali-icon.png';
import douyinIcon from '/@/assets/images/login/douyin-icon.png';
import qqIcon from '/@/assets/images/login/qq-icon.png';
import weiboIcon from '/@/assets/images/login/weibo-icon.png';
import feishuIcon from '/@/assets/images/login/feishu-icon.png';
import googleIcon from '/@/assets/images/login/google-icon.png';
import { router } from '/@/router';

import { md5 } from '/@/lib/encrypt';
import { useUserStore } from '/@/store/user.js';


//--------------------- 登录表单 ---------------------------------

const loginForm = reactive({
  username: '',
  password: '',
  code: '',
  uuid: '',
});
const rules = {
  username: [{ required: true, message: '用户名不能为空' }],
  password: [{ required: true, message: '密码不能为空' }],
  code: [{ required: true, message: '验证码不能为空' }],
};

const showPassword = ref(false);
const mode = import.meta.env.MODE;
const formRef = ref();

onMounted(() => {
  document.onkeyup = (e) => {
    if (e.keyCode == 13) {
      onLogin();
    }
  };
});

onUnmounted(() => {
  document.onkeyup = null;
});

async function onLogin() {
  formRef.value.validate().then(async () => {
    try {
      SmartLoading.show();
      // 密码加密
      let encryptForm = Object.assign({}, loginForm, {
        password: md5(loginForm.password),
      });
      const result = await loginApi.login(encryptForm);
      stopInterval();
      useUserStore().setToken(result.data.token);
      message.success('登录成功');
      router.push('/home');
    } catch (e) {
      loginForm.code = '';
      getCaptcha();
    } finally {
      SmartLoading.hide();
    }
  });
}

//--------------------- 验证码 ---------------------------------

const img = ref('');
async function getCaptcha() {
  let result = await loginApi.getCaptcha();
  img.value = result.data.img;
  loginForm.uuid = result.data.uuid;
  beginInterval(60);
}

let refrestInterval = null;

// 开始倒计时
function beginInterval(expireSeconds) {
  if (refrestInterval === null) {
    refrestInterval = setInterval(getCaptcha, expireSeconds * 1000);
  }
}

function stopInterval() {
  if (refrestInterval != null) {
    clearInterval(refrestInterval);
    refrestInterval = null;
  }
}

onMounted(getCaptcha);
</script>
<style lang="less" scoped>
@import './login.less';
</style>
