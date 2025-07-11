/*
 * 角色 api
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const roleApi = {
  // 分页查询
  queryList: (param) => {
    return getRequest('/sys/role/list', param);
  },
  // 新增角色
  addRole: (param) => {
    return postRequest('/sys/role/add', param);
  },
  // 更新角色
  updateRole: (param) => {
    return postRequest('/sys/role/edit', param);
  },
  // 删除角色
  deleteRole: (roleId) => {
    return getRequest('/sys/role/delete/' + roleId);
  },

  // 删除角色
  getMenuTree: (roleId) => {
    return getRequest('/sys/role/getMenuTree/' + roleId);
  },



};
