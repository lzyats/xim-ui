import { getRequest, postRequest } from '/@/lib/axios';

export const approveSpecialApi = {
  /**
   * 查询
   */
  queryList: (param) => {
    return getRequest('/approve/special/list', param);
  },
  specialEdit: (param) => {
    return postRequest('/approve/special/edit', param);
  },
};
