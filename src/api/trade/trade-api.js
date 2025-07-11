import { getRequest } from '/@/lib/axios';

export const tradeApi = {
  /**
   * 查询
   */
  queryList: (param) => {
    return getRequest('/wallet/trade/list', param);
  },
  /**
   * 详情
   */
  queryTradeInfo: (tradeId) => {
    return getRequest(`/wallet/trade/info/${tradeId}`);
  },
  /**
   * 详情
   */
  queryTradeList: (tradeId, param) => {
    return getRequest(`/wallet/trade/info/${tradeId}`, param);
  },

};
