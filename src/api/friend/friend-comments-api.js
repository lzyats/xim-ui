import { getRequest, postRequest } from '/@/lib/axios';

export const friendCommentApi = {
  /**
   * 查询
   */
  queryList: (param) => {
    return getRequest('/friend/comments/list', param);
  },
   /**
   * 查询某信息的所有评论
   */
   queryListall: (momentId) => {
    return getRequest(`/friend/comments/listall/${momentId}`);
  },
  /**
  * 删除指定评论
  */
  delete: (momentId) => {
   return getRequest(`/friend/comments/delete/${momentId}`);
 },
  
  /**
   * 添加账号
   */
  addComment: (param) => {
    return postRequest('/friend/comments/add', param);
  },
  /**
   * 基本信息
   */
  queryInfo: (commentId) => {
    return getRequest(`/friend/comment/info/${commentId}`);
  },
  /**
   * 注销
   */
  deletedComment: (commentId) => {
    return getRequest(`/friend/comment/deleted/${commentId}`);
  },
 

};
