/*
 * 项目的配置信息
 */
import { defineStore } from 'pinia';
import { appDefaultConfig } from '/@/config/app-config';
import localStorageKeyConst from '/@/constants/local-storage-key-const';
import { localRead } from '/@/lib/local-util';

let state = { ...appDefaultConfig };

let appConfigStr = localRead(localStorageKeyConst.APP_CONFIG);
let language = appDefaultConfig.language;
if (appConfigStr) {
  state = JSON.parse(appConfigStr);
  language = state.language;
}

/**
 * 获取初始化的语言
 */
export const getInitializedLanguage = function () {
  return language;
};

export const useAppConfigStore = defineStore({
  id: 'appConfig',
  state: () => ({
    // 读取config下的默认配置
    ...state,
  }),
  actions: {
    reset() {
      for (const k in appDefaultConfig) {
        this[k] = appDefaultConfig[k];
      }
    },
  },
});
