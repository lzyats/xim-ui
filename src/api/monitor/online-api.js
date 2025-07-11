/*
 * 在线用户
 */
import { getRequest } from '/@/lib/axios';

export const onlineApi = {
  // 列表
  queryList: (param) => {
    return getRequest('/monitor/online/list', param);
  },
  // 强退
  logout: (token) => {
    return getRequest(`/monitor/online/logout/${token}`);
  },
};
