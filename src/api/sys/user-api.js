/*
 * 用户 api
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const userApi = {
  // 分页查询
  queryList: (param) => {
    return getRequest('/sys/user/list', param);
  },
  // 新增用户
  addUser: (param) => {
    return postRequest('/sys/user/add', param);
  },
  // 更新用户
  updateUser: (param) => {
    return postRequest('/sys/user/edit', param);
  },
  // 删除用户
  deleteUser: (roleId) => {
    return getRequest('/sys/user/delete/' + roleId);
  },
  // 角色列表
  queryRoleList: () => {
    return getRequest('/sys/user/roleList');
  },
  // 修改密码
  updatePwd: (param) => {
    return postRequest('/sys/updatePwd', param);
  },
  // 重置密码
  resetPwd: (param) => {
    return postRequest('/sys/user/resetPwd', param);
  },
};
