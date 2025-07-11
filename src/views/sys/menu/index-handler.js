/*
 * 此文件是处理 菜单数据的类，主要用于：
 * 1、菜单树形表格的构造
 * 2、菜单的前端过滤
 */

import _ from 'lodash';

/**
 * 构建菜单表格树形数据
 */
export const buildMenuTableTree = (menuList) => {
  let topMenuList = [];
  const menuIdSet = new Set();
  for (const menu of menuList) {
    menuIdSet.add(menu.menuId);
  }

  for (const menu of menuList) {
    const parentId = menu.parentId;
    // 不存在父节点，则为顶级菜单
    if (!menuIdSet.has(parentId)) {
      topMenuList.push(menu);
    }
  }

  recursiveMenuTree(menuList, topMenuList);
  return topMenuList;
};

/**
 * 递归遍历菜单树形数据
 * @param {*} menuList
 * @param {*} parentArray
 */
function recursiveMenuTree(menuList, parentArray) {
  for (const parent of parentArray) {
    const children = menuList.filter((e) => e.parentId === parent.menuId);
    if (children.length > 0) {
      parent.children = children;
      recursiveMenuTree(menuList, parent.children);
    }
  }
}