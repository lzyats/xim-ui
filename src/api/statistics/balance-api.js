import { getRequest } from '/@/lib/axios';

export const balanceApi = {
  /**
   * 查询列表
   */
  queryList: () => {
    return getRequest('/statistics/user/balance');
  },
};
