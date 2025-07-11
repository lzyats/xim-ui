import { getRequest } from '/@/lib/axios';

export const trendApi = {

  userTrend: (param) => {
    return getRequest('/statistics/user/trend', param);
  },

};
