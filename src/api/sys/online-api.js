/*
 * 在线用户
 */
import { getRequest } from '/@/lib/axios';

export const onlineApi = {
  // 列表
  queryList: (param) => {
    return getRequest('/sys/online/list', param);
  },
  // 强退
  logout: (token) => {
    return getRequest(`/sys/online/logout/${token}`);
  },
};
