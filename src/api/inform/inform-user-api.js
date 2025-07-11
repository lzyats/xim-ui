import { getRequest, postRequest } from '/@/lib/axios';

export const informUserApi = {
  /**
   * 查询
   */
  queryList: (param) => {
    return getRequest('/inform/user/list', param);
  },
  /**
  * 忽略
  */
  ignoreUser: (informId) => {
    return getRequest(`/inform/user/ignore/${informId}`);
  },
};
