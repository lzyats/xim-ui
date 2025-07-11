import { getRequest, postRequest } from '/@/lib/axios';

export const cashApi = {

  /**
   * 配置详情
   */
  cashGetConfig: () => {
    return getRequest('/operate/cash/getConfig');
  },
  /**
   * 配置修改
  */
  cashConfigEdit: (param) => {
    return postRequest('/operate/cash/editConfig', param);
  },

};
