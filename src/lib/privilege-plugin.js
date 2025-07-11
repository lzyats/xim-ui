/*
 * 权限插件
 */
import { useUserStore } from '/@/store/user';

export const privilege = (value) => {
  // 获取功能点权限
  let userPointsList = useUserStore().getPointList;
  if (!userPointsList) {
    return false;
  }
  return userPointsList.includes(value);
};

export default {
  install: (app) => {
    app.config.globalProperties.$privilege = privilege;
  },
};
