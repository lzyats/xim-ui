/*
 * 登录页面
 */

export const loginRouters = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('/@/views/login/login.vue'),
    meta: {
      title: '登录',
      hideInMenu: true,
    },
  },
];
