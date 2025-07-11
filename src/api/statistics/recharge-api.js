import { getRequest } from '/@/lib/axios';

export const rechargeApi = {
  /**
   * 查询列表
   */
  queryList: (param) => {
    return getRequest('/statistics/user/recharge', param);
  },
};
