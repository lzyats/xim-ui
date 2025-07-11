import { postRequest } from '/@/lib/axios';

export const settingApi = {
  // 清空头像
  cleanPortrait: (param) => {
    return postRequest('/operate/setting/cleanPortrait', param);
  },
  // 清空消息
  cleanMsssage: (param) => {
    return postRequest('/operate/setting/cleanMessage', param);
  },
  // 清空交易
  cleanTrade: (param) => {
    return postRequest('/operate/setting/cleanTrade', param);
  },
};
