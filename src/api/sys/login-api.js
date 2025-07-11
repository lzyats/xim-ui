/*
 * 登录日志 api
 */
import { getRequest } from '/@/lib/axios';

export const logApi = {
  // 分页查询
  queryList: (param) => {
    return getRequest('/sys/login/list', param);
  },
  // 删除日志
  delete: (param) => {
    return getRequest('/sys/login/delete/' + param);
  },
};
