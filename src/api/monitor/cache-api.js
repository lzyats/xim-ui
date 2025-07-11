/*
 * 缓存监控
 */
import { getRequest } from '/@/lib/axios';

export const cacheApi = {
  // 列表
  queryList: () => {
    return getRequest('/monitor/cache');
  },
};
