import { getRequest } from '/@/lib/axios';

export const reportApi = {

  /**
   * 查询列表
   */
  queryList: (param) => {
    return getRequest('/statistics/user/report', param);
  },

};
