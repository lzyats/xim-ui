/*
 * 字典
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const dictApi = {
  // 分页查询
  quertList: (param) => {
    return getRequest('/sys/dict/list', param);
  },
  // 删除字典
  deleteDict: (dictId) => {
    return getRequest('/sys/dict/delete/' + dictId);
  },
  // 新增字典
  addDict: (param) => {
    return postRequest('/sys/dict/add', param);
  },
  // 修改字典
  editDict: (param) => {
    return postRequest('/sys/dict/edit', param);
  },
};
