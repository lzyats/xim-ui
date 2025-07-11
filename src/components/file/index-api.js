import { postRequest, getRequest, getDownload } from '/@/lib/axios';
export const fileApi = {
    // 文件上传 
    uploadUrl: '/support/file/upload',
    uploadFile: (param, folder) => {
        return postRequest(`/support/file/upload?folder=${folder}`, param);
    },
    /**
     * 分页查询  
     */
    queryPage: (param) => {
        return postRequest('/support/file/queryPage', param);
    },
    /**
     * 获取文件URL：根据fileKey
     */
    getUrl: (fileKey) => {
        return getRequest(`/support/file/getFileUrl?fileKey=${fileKey}`);
    },
    /**
     * 下载文件流（根据fileKey）
     */
    downLoadFile: (fileKey) => {
        return getDownload('/support/file/downLoad', { fileKey });
    },
};