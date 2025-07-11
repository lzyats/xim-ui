import { getRequest, postRequest } from '/@/lib/axios';

export const informGroupApi = {
  /**
   * 查询
   */
  queryList: (param) => {
    return getRequest('/inform/group/list', param);
  },
  /**
   * 忽略
   */
  ignoreGroup: (informId) => {
    return getRequest(`/inform/group/ignore/${informId}`);
  },
};
