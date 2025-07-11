import { getRequest, postRequest } from '/@/lib/axios';

export const portraitGroupApi = {
  /**
   * 查询列表
   */
  queryPortraitList: (param) => {
    return getRequest('/operate/portrait/group', param);
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
  portraitgroupDelete: (id) => {
    return getRequest(`/operate/portrait/delete/${id}`);
  },
  /**
   * 新增
   */
  portraitgroupAdd: (param) => {
    return postRequest('/operate/portrait/add', param);
  },

  /**
   * 修改
   */
  portraitgroupEdit: (param) => {
    return postRequest('/operate/portrait/edit', param);
  },
};
