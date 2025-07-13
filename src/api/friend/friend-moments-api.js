import { getRequest, postRequest } from '/@/lib/axios';

export const friendMomentsApi = {
  /**
   * 查询
   */
  queryList: (param) => {
    return getRequest('/friend/moments/list', param);
  },
  /**
   * 添加账号
   */
  addMoments: (param) => {
    return postRequest('/friend/moments/add', param);
  },
  /**
   * 基本信息
   */
  queryInfo: (momentId) => {
    return getRequest(`/friend/moments/info/${momentId}`);
  },
  /**
   * 注销
   */
  deletedMoments: (momentId) => {
    return getRequest(`/friend/moments/deleted/${momentId}`);
  },

   /**
   * 修改
   */
   editMoments: (param) => {
    return postRequest('/friend/moments/edit', param);
  },
 

};
