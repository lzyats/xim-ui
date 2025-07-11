import { getRequest } from '/@/lib/axios';

export const shoppingApi = {

  /**
   * 查询列表
   */
  queryList: (param) => {
    return getRequest('/statistics/user/shopping', param);
  },

};
