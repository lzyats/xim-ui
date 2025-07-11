/*
 * 登录
 */
import { getRequest, postRequest } from '/@/lib/axios';

export const loginApi = {
  /**
   * 登录 
   */
  login: (param) => {
    return postRequest('/auth/login', param);
  },

  /**
   * 退出登录 
   */
  logout: () => {
    return getRequest('/auth/logout');
  },

  /**
   * 获取验证码 
   */
  getCaptcha: () => {
    return getRequest('/auth/getCaptcha');
  },

};
