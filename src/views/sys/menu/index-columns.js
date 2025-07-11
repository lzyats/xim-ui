/*
 * 菜单表格列
 */
import { ref } from 'vue';
export const columns = ref([
  {
    title: '名称',
    dataIndex: 'menuName',
    key: 'ID',
    width: 200,
  },
  {
    title: '类型',
    dataIndex: 'menuType',
    width: 80,
    align: 'center',
  },
  {
    title: '图标',
    dataIndex: 'icon',
    width: 80,
    align: 'center',
  },
  {
    title: '路径',
    dataIndex: 'path',
    ellipsis: true,
  },
  {
    title: '组件',
    dataIndex: 'component',
    ellipsis: true,
  },
  {
    title: '权限',
    dataIndex: 'perms',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '顺序',
    dataIndex: 'sort',
    width: 80,
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 140,
    align: 'center',
  },
]);
