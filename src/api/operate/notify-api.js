import { getRequest, postRequest } from '/@/lib/axios';

export const notifyApi = {

    /**
     * 详情
     */
    getNotifyInfo: () => {
        return getRequest('/operate/notify/info');
    },

    /**
     * 修改
     */
    notifyEdit: (param) => {
        return postRequest('/operate/notify/edit', param);
    },

    /**
     * demo
     */
    getNotifyDemo: () => {
        return getRequest('/operate/notify/getDemo');
    },

    /**
     * 发布
     */
    notifyPush: (param) => {
        return postRequest('/operate/notify/push', param);
    },

};
