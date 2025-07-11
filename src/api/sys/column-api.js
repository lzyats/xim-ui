import { postRequest, getRequest } from '/@/lib/axios';
export const columnApi = {
    // 修改表格列
    editColumn: (param) => {
        return postRequest('/sys/column/edit', param);
    },
    // 查询表格列
    getColumns: (tableId) => {
        return getRequest(`/sys/column/getColumns/${tableId}`);
    },
    // 删除表格列
    deleteColumns: (tableId) => {
        return getRequest(`/sys/column/delete/${tableId}`);
    },
};