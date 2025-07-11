/*
 * 系统
 */
import { getRequest, postRequest } from '/@/lib/axios';

export const indexApi = {
  /**
   * 获取详情 
   */
  getInfo: () => {
    return getRequest('/sys/getInfo');
  },

  /**
   * 获取路由 
   */
  getRouters: () => {
    return getRequest('/sys/getRouters');
  },

  /**
   * 获取菜单 
   */
  getMenus: () => {
    return getRequest('/sys/getMenus');
  },

  /**
   * 修改密码 
   */
  getMenus: () => {
    return getRequest('/sys/getMenus');
  },

};
