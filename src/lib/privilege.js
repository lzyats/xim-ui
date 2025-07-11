/*
 * 权限
 */

import { useUserStore } from '/@/store/user';
import _ from 'lodash';

export function privilegeDirective(el, binding) {
  // 获取功能点权限
  let userPointsList = useUserStore().getPointList;
  if (!userPointsList) {
    return false;
  }
  // 如果没有权限，删除节点
  if (!_.includes(userPointsList, binding.value)) {
    el.parentNode.removeChild(el);
  }
  return true;
}
