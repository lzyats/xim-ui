import { getRequest, postRequest } from '/@/lib/axios';

export const chatGroupApi = {
  /**
   * 查询
   */
  queryList: (param) => {
    return getRequest('/chat/group/list', param);
  },
  /**
   * 基本信息
   */
  queryDetail: (groupId) => {
    return getRequest(`/chat/group/info/${groupId}`);
  },
  /**
   * 封禁群组
   */
  bannedGroup: (param) => {
    return postRequest('/chat/group/banned', param);
  },
  /**
   * 群组成员信息
   */
  queryGroupMemberList: (groupId, param) => {
    return getRequest(`/chat/group/memberList/${groupId}`, param);
  },
  /**
   * 群组操作日志
   */
  queryGroupLog: (groupId, param) => {
    return getRequest(`/chat/group/log/${groupId}`, param);
  },
  /**
   * 用户聊天信息
   */
  queryGroupMessage: (groupId, param) => {
    return getRequest(`/chat/group/message/${groupId}`, param);
  },
  /**
   * 账户充值提现 
   */
  userRecharge: (param) => {
    return postRequest('/chat/user/recharge', param);
  },
  /**
   * 用户操作日志 
   */
  queryUserLog: (userId, param) => {
    return getRequest(`/chat/user/log/${userId}`, param);
  },
  /**
   * 用户收支明细 
   */
  queryUserIncome: (userId, param) => {
    return getRequest(`/chat/user/income/${userId}`, param);
  },
  editGroupSetting: (param) => {
    return postRequest('/chat/group/editGroup', param);
  },
};
