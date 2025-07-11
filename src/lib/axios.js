/*
 * ajax请求
 */
import { message } from 'ant-design-vue';
import axios from 'axios';
import { localClear, localRead } from './local-util';
import _ from 'lodash';
import LocalStorageKeyConst from '/@/constants/local-storage-key-const.js';
import { SmartLoading } from '/@/components/framework/smart-loading';

// token的消息头
const TOKEN_HEADER = 'Authorization';

// 创建axios对象
const smartAxios = axios.create({
  baseURL: import.meta.env.VITE_APP_REQUEST,
});

// 退出系统
function logout() {
  localClear();
  location.href = '/';
}

// 隐藏弹框
function hide() {
  try {
    // 确保在 Pinia store 初始化后再使用 SmartLoading
    if (typeof window !== 'undefined' && window.__pinia) {
      SmartLoading.hide();
    }
  } catch (error) {
    console.warn('SmartLoading.hide error:', error);
  }finally {
    SmartLoading.hide();
  }
}

// ================================= 请求拦截器 =================================

smartAxios.interceptors.request.use(
  (config) => {
    // 在发送请求之前消息头加入token token
    const token = localRead(LocalStorageKeyConst.USER_TOKEN);
    if (token) {
      config.headers[TOKEN_HEADER] = token;
    } else {
      delete config.headers[TOKEN_HEADER];
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// ================================= 响应拦截器 =================================

// 添加响应拦截器
smartAxios.interceptors.response.use(
  (response) => {
    // 根据content-type ，判断是否为 json 数据
    let contentType = response.headers['content-type'] ? response.headers['content-type'] : response.headers['Content-Type'];
    if (contentType.indexOf('application/json') === -1) {
      return Promise.resolve(response);
    }

    // 如果是json数据
    if (response.data && response.data instanceof Blob) {
      return Promise.reject(response.data);
    }

    const res = response.data;
    if (res.code && res.code !== 200) {
      // 重新登录
      if (res.code === 401) {
        message.destroy();
        message.error('您没有登录，请重新登录');
        setTimeout(logout, 300);
        setTimeout(hide, 300);
        return Promise.reject(response);
      }

      // 系统错误
      if (res.code === 500) {
        message.destroy();
        message.error(res.msg);
        setTimeout(hide, 300);
        return Promise.reject(response);
      }

      message.destroy();
      message.error(res.msg);
      setTimeout(hide, 300);
      return Promise.reject(response);
    } else {
      setTimeout(hide, 300);
      return Promise.resolve(res);
    }
  },
  (error) => {
    // 对响应错误做点什么
    if (error.message.indexOf('timeout') !== -1) {
      message.destroy();
      message.error('网络超时');
    } else if (error.message === 'Network Error') {
      message.destroy();
      message.error('网络连接错误');
    } else if (error.message.indexOf('Request') !== -1) {
      message.destroy();
      message.error('网络发生错误');
    }
    return Promise.reject(error);
  }
);

// ================================= 对外提供请求方法：通用请求，get， post, 下载download等 =================================

/**
 * get请求
 */
export const getRequest = (url, params) => {
  return request({ url, method: 'get', params });
};

/**
 * 通用请求封装
 * @param config
 */
export const request = (config) => {
  return smartAxios.request(config);
};

/**
 * post请求
 */
export const postRequest = (url, data) => {
  return request({
    data,
    url,
    method: 'post',
  });
};

// ================================= 下载 =================================

export const postDownload = function (url, data) {
  request({
    method: 'post',
    url,
    data,
    responseType: 'blob',
  }).then((data) => {
    handleDownloadData(data);
  }).catch((error) => {
    handleDownloadError(error);
  });
};

/**
 * 文件下载
 */
export const getDownload = function (url, params) {
  request({
    method: 'get',
    url,
    params,
    responseType: 'blob',
  }).then((data) => {
    handleDownloadData(data);
  }).catch((error) => {
    handleDownloadError(error);
  });
};

function handleDownloadError(error) {
  if (error instanceof Blob) {
    const fileReader = new FileReader();
    fileReader.readAsText(error);
    fileReader.onload = () => {
      const msg = fileReader.result;
      const jsonMsg = JSON.parse(msg);
      message.destroy();
      message.error(jsonMsg.msg);
    };
  } else {
    message.destroy();
    message.error('网络发生错误', error);
  }
}

function generateTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

function handleDownloadData(response) {
  if (!response) {
    return;
  }
  const timestamp = generateTimestamp();
  const fileName = `支付宝批量付款文件上传模板_${timestamp}.xlsx`;
  // 获取返回类型
  let contentType = _.isUndefined(response.headers['content-type']) ? response.headers['Content-Type'] : response.headers['content-type']
  console.log('contentType:', contentType);
  // 构建下载数据
  let url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
  let link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;

  // 从消息头获取文件名
//   let str = _.isUndefined(response.headers['content-disposition'])
//     ? response.headers['Content-Disposition'].split(';')[1]
//     : response.headers['content-disposition'].split(';')[1];
// console.log('str:', str);
//   let filename = _.isUndefined(str.split('fileName=')[1]) ? str.split('filename=')[1] : str.split('fileName=')[1];
//   console.log('filename:', filename);
  link.setAttribute('download', decodeURIComponent(fileName));

  // 触发点击下载
  document.body.appendChild(link);
  link.click();

  // 下载完释放
  document.body.removeChild(link); // 下载完成移除元素
  window.URL.revokeObjectURL(url); // 释放掉blob对象
}
