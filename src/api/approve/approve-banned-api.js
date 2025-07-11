import { getRequest, postRequest } from '/@/lib/axios';

export const approveBannedApi = {
  /**
   * 查询
   */
  queryList: (param) => {
    return getRequest('/approve/banned/list', param);
  },
  /**
   * 详情
   */
  queryInfo: (userId) => {
    return getRequest(`/approve/banned/info/${userId}`);
  },
  /**
   * 处理
   */
  banned: (param) => {
    return postRequest('/approve/banned/edit', param);
  },

};
