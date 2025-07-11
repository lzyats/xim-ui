/*
 * 操作日志 api
 */
import { getRequest } from '/@/lib/axios';

export const logApi = {
  // 分页查询
  queryList: (param) => {
    return getRequest('/sys/log/list', param);
  },
  // 删除
  delete: (param) => {
    return getRequest('/sys/log/delete/' + param);
  },

};
