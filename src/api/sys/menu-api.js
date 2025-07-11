/*
 * 菜单
 */
import { getRequest, postRequest } from '/@/lib/axios';

export const menuApi = {
  /**
   * 添加菜单
   */
  addMenu: (param) => {
    return postRequest('/sys/menu/add', param);
  },

  /**
   * 更新菜单
   */
  updateMenu: (param) => {
    return postRequest('/sys/menu/edit', param);
  },

  /**
   * 删除菜单
   */
  deleteMenu: (menuId) => {
    return getRequest(`/sys/menu/delete/${menuId}`);
  },

  /**
  * 拷贝菜单
  */
  copyMenu: (menuId) => {
    return getRequest(`/sys/menu/copy/${menuId}`);
  },

  /**
   * 查询所有菜单列表
   */
  queryList: () => {
    return getRequest('/sys/menu/list');
  },

  /**
   * 查询菜单树
   */
  queryMenuTree: () => {
    return getRequest(`/sys/menu/menuTree`);
  },

};
