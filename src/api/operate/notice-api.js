import { getRequest, postRequest } from '/@/lib/axios';

export const noticeApi = {
  /**
   * 查询列表
   */
  queryNoticeList: (param) => {
    return getRequest('/operate/notice/list', param);
  },
  /**
   * 详情
   */
  queryNoticeInfo: (id) => {
    return getRequest(`/operate/notice/info/${id}`);
  },
  /**
   * 删除
   */
  noticeDelete: (id) => {
    return getRequest(`/operate/notice/delete/${id}`);
  },
  /**
   * 新增
   */
  noticeAdd: (param) => {
    return postRequest('/operate/notice/add', param);
  },
  /**
   * 修改
   */
  noticeEdit: (param) => {
    return postRequest('/operate/notice/edit', param);
  },
  /**
   * 拷贝
   */
  noticeCopy: (id) => {
    return getRequest(`/operate/notice/copy/${id}`);
  },
};
