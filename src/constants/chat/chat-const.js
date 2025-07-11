
// 下拉框枚举
export const CODE_AUTH_ENUM = {
  AUTH_LING: {
    value: '0',
    desc: '未认证',
  },
  AUTH_YI: {
    value: '1',
    desc: '认证中',
  },
  AUTH_ER: {
    value: '2',
    desc: '已认证',
  },
  AUTH_SAN: {
    value: '3',
    desc: '已拒绝',
  },

};
export const CODE_SPECIAL_ENUM = {
  SPECIAL_Y: {
    value: 'Y',
    desc: '是',
  },
  SPECIAL_N: {
    value: 'N',
    desc: '否',
  },
};
export const CODE_STATUS_ENUM = {
  STATUS_Y: {
    value: 'Y',
    desc: '正常',
  },
  STATUS_N: {
    value: 'N',
    desc: '注销',
  },
};
export const CODE_STATUS_USER_HANDLE = {
  STATUS_Y: {
    value: 'Y',
    desc: '已处理',
  },
  STATUS_N: {
    value: 'N',
    desc: '未处理',
  },
};
export const CODE_BANNED_ENUM = {
  BANNED_Y: {
    value: 'Y',
    desc: '封禁',
  },
  BANNED_N: {
    value: 'N',
    desc: '正常',
  },
};
export const CODE_SORT_ENUM = {
  SORT_Y: {
    value: 'Y',
    desc: '余额排序',
  },
  SORT_N: {
    value: 'N',
    desc: '正常排序',
  },
};
export const CODE_BANNED_TIME_ENUM = {
  BANNED_A: {
    value: '1',
    desc: '1天',
  },
  BANNED_B: {
    value: '2',
    desc: '3天',
  },
  BANNED_C: {
    value: '3',
    desc: '7天',
  },
  BANNED_D: {
    value: '4',
    desc: '1月',
  },
  BANNED_E: {
    value: '5',
    desc: '3月',
  },
  BANNED_F: {
    value: '6',
    desc: '永久',
  },
};
export const CODE_BANNED_TYPE_ENUM = {
  BANNED_G: {
    value: '1',
    desc: '涉及诽谤/辱骂/威胁/挑衅',
  },
  BANNED_H: {
    value: '2',
    desc: '涉嫌广告推销',
  },
  BANNED_R: {
    value: '3',
    desc: '涉嫌色情暴力',
  },
  BANNED_N: {
    value: '4',
    desc: '涉嫌反动/诈骗/谣言',
  },
  BANNED_K: {
    value: '5',
    desc: '涉及散布他人隐私',
  },
  BANNED_L: {
    value: '6',
    desc: '其他违规行为',
  },
};
export default {
  CODE_AUTH_ENUM, CODE_BANNED_TIME_ENUM, CODE_BANNED_TYPE_ENUM, CODE_STATUS_USER_HANDLE,
  CODE_SPECIAL_ENUM, CODE_BANNED_ENUM, CODE_STATUS_ENUM, CODE_SORT_ENUM
};
