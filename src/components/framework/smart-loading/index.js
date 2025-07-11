/*
 * loading 组件
 */
import { useSpinStore } from "/@/store/spin";

export const SmartLoading = {
  show: () => {
    useSpinStore().show();
  },

  hide: () => {
    useSpinStore().hide();
  },
};
