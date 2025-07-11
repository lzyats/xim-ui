import { getRequest, postRequest } from '/@/lib/axios';

export const versionApi = {
  /**
   * 查询列表
   */
  queryVersionList: () => {
    return getRequest('/operate/version/list');
  },
  /**
   * 修改
   */
  versionEdit: (param) => {
    return postRequest('/operate/version/edit', param);
  },

  /**
   * 详情
   */
  versionGetConfig: () => {
    return getRequest('/operate/version/getConfig');
  },

  /**
   * 修改
   */
  editVersionConfig: (param) => {
    return postRequest('/operate/version/editConfig', param);
  },



};
