
import { getRequest, postRequest } from '/@/lib/axios';

export const helpApi = {
  /**
   * 查询列表
   */
  queryHelpList: (param) => {
    return getRequest('/operate/help/list', param);
  },
  /**
   * 详情
   */
  queryHelpInfo: (id) => {
    return getRequest(`/operate/help/info/${id}`);
  },
  /**
   * 删除
   */
  helpDelete: (id) => {
    return getRequest(`/operate/help/delete/${id}`);
  },
  /**
   * 新增
   */
  helpAdd: (param) => {
    return postRequest('/operate/help/add', param);
  },
  /**
   * 修改
   */
  helpEdit: (param) => {
    return postRequest('/operate/help/edit', param);
  },
};
