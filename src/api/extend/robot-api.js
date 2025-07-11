import { getRequest, postRequest } from '/@/lib/axios';

export const robotApi = {
  /**
   * 查询
   */
  queryList: () => {
    return getRequest('/extend/robot/robot/list');
  },

  /**
   * 修改
   */
  robotEdit: (param) => {
    return postRequest('/extend/robot/robot/edit', param);
  },
  /**
   * 重置秘钥
   */
  resetRobot: (id) => {
    return getRequest(`/extend/robot/robot/reset/${id}`);
  },

  /**
   * 关注回复列表
   */
  subscribeReply: (param) => {
    return getRequest('/extend/robot/subscribe/list', param);
  },
  /**
   * 新增关注回复
   */
  addSubscribe: (param) => {
    return postRequest('/extend/robot/subscribe/add', param);
  },
  /**
  * 修改关注回复
  */
  editSubscribe: (param) => {
    return postRequest('/extend/robot/subscribe/edit', param);
  },

  /**
  * 删除关注回复
  */
  deleteSubscribeReply: (robotId) => {
    return getRequest(`/extend/robot/subscribe/delete/${robotId}`);
  },

  /**
  * 复制关注回复
  */
  copySubscribeReply: (robotId) => {
    return getRequest(`/extend/robot/subscribe/copy/${robotId}`);
  },


  /**
   * 事件列表
   */
  evenReplyList: (param) => {
    return getRequest('/extend/robot/even/list', param);
  },

  /**
   * 新增事件回复
   */
  addEven: (param) => {
    return postRequest('/extend/robot/even/add', param);
  },
  /**
  * 修改事件回复
  */
  editEven: (param) => {
    return postRequest('/extend/robot/even/edit', param);
  },

  /**
  * 删除事件回复
  */
  deleteEven: (robotId) => {
    return getRequest(`/extend/robot/even/delete/${robotId}`);
  },

  /**
  * 复制事件回复
  */
  copyEven: (robotId) => {
    return getRequest(`/extend/robot/even/copy/${robotId}`);
  },

  //三个下拉框
  extendMini: (robotId) => {
    return getRequest(`/extend/robot/robot/extend/mini/${robotId}`);
  },
  extendPage: (robotId) => {
    return getRequest(`/extend/robot/robot/extend/page/${robotId}`);
  },
  extendEven: (robotId) => {
    return getRequest(`/extend/robot/robot/extend/even/${robotId}`);
  },

  /**
  * 新增关注回复
  */
  editRobotMenu: (param) => {
    return postRequest('/extend/robot/robot/menu', param);
  },
};
