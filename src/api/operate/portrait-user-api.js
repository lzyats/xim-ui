import { getRequest, postRequest } from '/@/lib/axios';

export const portraitUserApi = {
  /**
   * 查询列表
   */
  queryPortraitList: (param) => {
    return getRequest('/operate/portrait/user', param);
  },

  /**
   * 详情
   */
  queryPortraitInfo: (id) => {
    return getRequest(`/operate/portrait/info/${id}`);
  },

  /**
   * 删除
   */
  portraituserDelete: (id) => {
    return getRequest(`/operate/portrait/delete/${id}`);
  },
  /**
   * 新增
   */
  portraituserAdd: (param) => {
    return postRequest('/operate/portrait/add', param);
  },
  /**
   * 修改
   */
  portraituserEdit: (param) => {
    return postRequest('/operate/portrait/edit', param);
  },


};
