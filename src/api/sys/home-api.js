import { getRequest } from '/@/lib/axios';

export const homeApi = {

  userVersion: () => {
    return getRequest('/home/user/version');
  },

  userDevice: () => {
    return getRequest('/home/user/device');
  },

  userTrend: (param) => {
    return getRequest('/home/user/trend', param);
  },

  userVisit: (param) => {
    return getRequest('/home/user/visit', param);
  },

};
