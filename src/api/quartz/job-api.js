/*
 * job api
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const jobApi = {
  // 分页查询
  queryList: (param) => {
    return getRequest('/quartz/job/list', param);
  },
  // 新增任务
  addJob: (param) => {
    return postRequest('/quartz/job/add', param);
  },
  // 更新任务
  updateJob: (param) => {
    return postRequest('/quartz/job/edit', param);
  },
  // 执行任务
  runJob: (jobId) => {
    return getRequest('/quartz/job/run/' + jobId);
  },
  // 删除任务
  deleteJob: (jobId) => {
    return getRequest('/quartz/job/delete/' + jobId);
  },
};
