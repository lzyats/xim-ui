import { getRequest, postRequest } from '/@/lib/axios';

export const uniApi = {
  /**
   * 查询列表
   */
  queryUniList: (param) => {
    return getRequest('/extend/uni/list', param);
  },

  /**
   * 删除
   */
  uniItemDelete: (id) => {
    return getRequest(`/extend/uni/delete/${id}`);
  },
  /**
   * 新增
   */
  uniItemAdd: (param) => {
    return postRequest('/extend/uni/add', param);
  },
  /**
   * 修改
   */
  uniItemEdit: (param) => {
    return postRequest('/extend/uni/edit', param);
  },


};
