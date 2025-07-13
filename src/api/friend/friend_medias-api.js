import { getRequest, postRequest } from '/@/lib/axios';

export const friendMediasApi = {
  /**
   * 查询
   */
  queryList: (param) => {
    return getRequest('/friend/medias/list', param);
  },
   /**
   * 查询某信息的所有评论
   */
   queryListall: (momentId) => {
    return getRequest(`/friend/medias/listall/${momentId}`);
  },
  /**
  * 删除指定评论
  */
  delete: (momentId) => {
   return getRequest(`/friend/medias/delete/${momentId}`);
 },
  
  /**
   * 添加账号
   */
  addMedia: (param) => {
    return postRequest('/friend/medias/add', param);
  },
   /**
   * 添加账号
   */
  editMedia: (param) => {
    return postRequest('/friend/medias/edit', param);
  },
  /**
   * 基本信息
   */
  queryInfo: (commentId) => {
    return getRequest(`/friend/medias/info/${commentId}`);
  },
  /**
   * 注销
   */
  deletedMedia: (commentId) => {
    return getRequest(`/friend/medias/deleted/${commentId}`);
  },
 

};
