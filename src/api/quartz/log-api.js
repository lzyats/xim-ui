/*
 * job api
 */
import { getRequest } from '/@/lib/axios';

export const logApi = {
  // 分页查询
  queryList: (param) => {
    return getRequest('/quartz/log/list', param);
  },
  // 删除日志
  deleteJob: (param) => {
    return getRequest('/quartz/log/delete/' + param);
  },

};
