import { getRequest, postRequest } from '/@/lib/axios';

export const rechargeApi = {
  /**
   * 查询列表
   */
  queryRechargeList: () => {
    return getRequest('/operate/recharge/list');
  },
  /**
   * 修改
   */
  rechargeEdit: (param) => {
    return postRequest('/operate/recharge/edit', param);
  },
  /**
   * 详情
   */
  rechargeGetConfig: () => {
    return getRequest('/operate/recharge/getConfig');
  },
  /**
   * 修改
   */
  editRechargeConfig: (param) => {
    return postRequest('/operate/recharge/editConfig', param);
  },



};
