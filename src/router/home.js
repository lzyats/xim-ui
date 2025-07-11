/*
 * 首页路由
 */
import { HOME_PAGE_NAME, HOME_PAGE_PATH, HELP_PAGE_NAME, HELP_PAGE_PATH } from '/@/constants/sys/home-const';
import { MENU_TYPE_ENUM } from '/@/constants/sys/menu-const';
import SmartLayout from '/@/layout/index.vue';

export const homeRouters = [
  {
    path: '/',
    name: '_home',
    redirect: { name: HOME_PAGE_NAME },
    component: SmartLayout,
    meta: {
      title: '首页',
      menuType: MENU_TYPE_ENUM.CATALOG.value,
      icon: 'HomeOutlined',
    },
    children: [
      {
        path: HOME_PAGE_PATH,
        name: HOME_PAGE_NAME,
        meta: {
          title: '首页',
          menuType: MENU_TYPE_ENUM.MENU.value,
          icon: 'HomeOutlined',
          parentMenuList: [{ name: '_home', title: '首页' }],
        },
        component: () => import('/@/views/sys/home/index.vue'),
      },
      {
        path: HELP_PAGE_PATH,
        name: HELP_PAGE_NAME,
        meta: {
          title: '帮助中心',
          menuType: MENU_TYPE_ENUM.MENU.value,
        },
        component: () => import('/@//layout/components/header/header-help.vue'),
      },
      {
        path: '/chat/group/:menuId',
        name: 'group',
        meta: {
          title: '群组详情',
          menuType: MENU_TYPE_ENUM.MENU.value,
        },
        component: () => import('/@//views/chat/group/index-info.vue'),
      },
      {
        path: '/chat/user/:menuId',
        name: 'user',
        meta: {
          title: '用户详情',
          menuType: MENU_TYPE_ENUM.MENU.value,
        },
        component: () => import('/@//views/chat/user/index-info.vue'),
      },
    ],
  },
];
