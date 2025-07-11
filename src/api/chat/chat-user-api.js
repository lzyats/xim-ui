import { getRequest, postRequest } from '/@/lib/axios';

export const chatUserApi = {
  /**
   * 查询
   */
  queryList: (param) => {
    return getRequest('/chat/user/list', param);
  },
  /**
   * 添加账号
   */
  addUser: (param) => {
    return postRequest('/chat/user/add', param);
  },
  /**
   * 基本信息
   */
  queryInfo: (userId) => {
    return getRequest(`/chat/user/info/${userId}`);
  },
  /**
   * 注销用户
   */
  deletedUser: (userId) => {
    return getRequest(`/chat/user/deleted/${userId}`);
  },
  /**
   * 重置密码
   */
  resetPwd: (userId) => {
    return getRequest(`/chat/user/resetPwd/${userId}`);
  },
  /**
  * 重置支付
  */
  resetPay: (userId) => {
    return getRequest(`/chat/user/resetPay/${userId}`);
  },
  /**
   * 解除认证
   */
  cancelAuth: (userId) => {
    return getRequest(`/chat/user/cancelAuth/${userId}`);
  },
  /**
   * 封禁用户
   */
  bannedUser: (param) => {
    return postRequest('/chat/user/banned', param);
  },
  /**
   * 测试账号
   */
  updateSpecial: (param) => {
    return postRequest(`/chat/user/special`, param);
  },
  /**
   * 查询认证
   */
  queryAuth: (userId) => {
    return getRequest(`/chat/user/getAuth/${userId}`);
  },
  /**
   * 好友信息
   */
  queryFriend: (userId, param) => {
    return getRequest(`/chat/user/friendList/${userId}`, param);
  },
  /**
   * 关联地址
   */
  queryIp: (userId, param) => {
    return getRequest(`/chat/user/ipList/${userId}`, param);
  },
  /**
   * 关联实名
   */
  queryAuther: (userId, param) => {
    return getRequest(`/chat/user/authList/${userId}`, param);
  },
  /**
  * 关联邮箱
  */
  queryEmail: (userId, param) => {
    return getRequest(`/chat/user/emailList/${userId}`, param);
  },
  /**
   * 操作日志
   */
  queryLog: (userId, param) => {
    return getRequest(`/chat/user/log/${userId}`, param);
  },
  /**
   * 群组信息
   */
  queryChatGroup: (userId, param) => {
    return getRequest(`/chat/user/groupList/${userId}`, param);
  },
  /**
   * 聊天信息
   */
  queryUserMessage: (userId, param) => {
    return getRequest(`/chat/user/message/${userId}`, param);
  },
  /**
   * 充值提现
   */
  userRecharge: (param) => {
    return postRequest('/chat/user/recharge', param);
  },
  /**
   * 用户备注
   */
  userRemark: (param) => {
    return postRequest('/chat/user/remark', param);
  },
  /**
   * 用户邮箱
   */
  userEmail: (param) => {
    return postRequest('/chat/user/email', param);
  },
  /**
   * 收支明细 
   */
  queryUserIncome: (userId, param) => {
    return getRequest(`/chat/user/income/${userId}`, param);
  },

};
