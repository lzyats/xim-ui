import { getRequest, postRequest } from '/@/lib/axios';

export const approveAuthApi = {
  /**
   * 查询
   */
  queryList: (param) => {
    return getRequest('/approve/auth/list', param);
  },
  /**
   *  详情
   */
  queryAuthInfo: (userId) => {
    return getRequest(`/approve/auth/info/${userId}`);
  },

  /**
   * 同意或者拒绝
   */
  authEdit: (param) => {
    return postRequest('/approve/auth/edit', param);
  },

};
