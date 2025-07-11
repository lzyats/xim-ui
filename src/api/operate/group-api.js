import { getRequest, postRequest } from '/@/lib/axios';

export const groupApi = {
  /**
   * 查询列表
   */
  queryGroupList: () => {
    return getRequest('/operate/group/list');
  },
  /**
   * 修改
   */
  groupEdit: (param) => {
    return postRequest('/operate/group/edit', param);
  },
  /**
   * 配置详情
   */
  groupGetConfig: () => {
    return getRequest('/operate/group/getConfig');
  },
  /**
   * 配置修改
   */
  editGroupConfig: (param) => {
    return postRequest('/operate/group/editConfig', param);
  },
};
