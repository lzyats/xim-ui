import { getRequest } from '/@/lib/axios';

export const cashApi = {

  /**
   * 查询列表
   */
  queryList: (param) => {
    return getRequest('/statistics/user/cash', param);
  },

};
