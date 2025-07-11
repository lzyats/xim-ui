import { getRequest, postRequest ,getDownload} from '/@/lib/axios';

export const approveCashApi = {
  /**
   * 查询
   */
  queryList: (param) => {
    return getRequest('/approve/cash/list', param);
  },
  /**
   * 详情
   */
  queryInfo: (tradeId) => {
    return getRequest(`/approve/cash/info/${tradeId}`);
  },
  /**
   * 同意或者拒绝
   */
  cashEdit: (param) => {
    return postRequest('/approve/cash/edit', param);
  },
/**
   * 详情
   */
exportData: () => {
  return getDownload(`/approve/cash/export`);
},
};
