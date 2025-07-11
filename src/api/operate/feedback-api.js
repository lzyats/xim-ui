import { getRequest, postRequest } from '/@/lib/axios';

export const feedbackApi = {
  /**
   * 查询列表
   */
  queryFeedbackList: (param) => {
    return getRequest('/operate/feedback/list', param);
  },

  /**
   * 详情
   */
  queryFeedbackInfo: (id) => {
    return getRequest(`/operate/feedback/info/${id}`);
  },

  /**
   * 删除
   */
  feedbackDelete: (id) => {
    return getRequest(`/operate/feedback/delete/${id}`);
  },

  /**
   * 处理
   */
  feedbackEdit: (id) => {
    return getRequest(`/operate/feedback/edit/${id}`);
  },

};
