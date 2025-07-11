
import { getRequest } from '/@/lib/axios';

export const visitApi = {

  userVisit: (param) => {
    return getRequest('/statistics/user/visit', param);
  },

};
