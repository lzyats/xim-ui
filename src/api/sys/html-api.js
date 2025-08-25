import { getRequest, postRequest } from '/@/lib/axios';

export const noticeApi = {
  /**
   * 查询列表
   */
  queryNoticeList: (param) => {
    return getRequest('/sys/html/list', param);
  },
  /**
   * 详情
   */
  queryNoticeInfo: (id) => {
    return getRequest(`/sys/html/info/${id}`);
  },
  /**
   * 删除
   */
  noticeDelete: (id) => {
    return getRequest(`/sys/html/delete/${id}`);
  },
  /**
   * 新增
   */
  noticeAdd: (param) => {
    return postRequest('/sys/html/add', param);
  },
  /**
   * 修改
   */
  noticeEdit: (param) => {
    return postRequest('/sys/html/edit', param);
  },
};
