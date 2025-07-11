import { getRequest, postRequest } from '/@/lib/axios';

export const configApi = {

  /**
   * 配置详情
   */
  configGetConfig: () => {
    return getRequest('/operate/config/getConfig');
  },

  /**
   * 配置修改
   */
  configConfigEdit: (param) => {
    return postRequest('/operate/config/editConfig', param);
  },



};
