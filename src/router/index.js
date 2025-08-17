/*
 * 路由
 */
import nProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { createRouter, createWebHashHistory } from 'vue-router';
import { routerArray } from './routers';
import { PAGE_PATH_404, PAGE_PATH_LOGIN } from '/@/constants/common-const';
import { HOME_PAGE_NAME } from '/@/constants/sys/home-const';
import SmartLayout from '/@/layout/index.vue';
import { useUserStore } from '/@/store/user';
import { localClear, localRead } from '/@/lib/local-util';
import _ from 'lodash';
import LocalStorageKeyConst from '/@/constants/local-storage-key-const.js';

export const router = createRouter({
  history: createWebHashHistory(),
  routes: routerArray,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

// ----------------------- 路由加载前 -----------------------
router.beforeEach(async (to, from, next) => {
  // 进度条开启
  nProgress.start();

  // 公共页面，任何时候都可以跳转
  if (to.path === PAGE_PATH_404 || to.path === PAGE_PATH_LOGIN) {
    next();
    return;
  }

  // 验证登录
  const token = localRead(LocalStorageKeyConst.USER_TOKEN);
  if (!token) {
    localClear();
    next({ path: PAGE_PATH_LOGIN });
    return;
  }

  // 首页（ 需要登录 ，但不需要验证权限）
  if (to.path === HOME_PAGE_NAME) {
    next();
    return;
  }

  // 下载路由对应的 页面组件，并修改组件的Name，如果修改过，则不需要修改
  let routerInfo = routerMap.get(to.name);
  if (routerInfo && _.isFunction(routerInfo.component)) {
    // 因为组件component 为 lazy load是个方法，所以可以直接执行 component()方法
    routerInfo.component().then((val) => {
      // 修改组件的name
      val.default.name = to.meta.menuId;
    });
  }

  // 群组详情
  if ('group' == to.name || 'user' == to.name) {
    // 获取菜单
    const menuId = to.params.menuId;
    const name = to.name;
    const modules = import.meta.glob('../views/**/**.vue');
    // 添加路由
    routerInfo = {
      path: to.fullPath,
      name: menuId,
      meta: {
        title: to.meta.title,
        menuType: to.meta.menuType,
        ignore: false,
      },
      component: modules[`../views/chat/` + name + `/index-info.vue`],
    };
    // 添加路由
    router.addRoute('_home', routerInfo);
    // 添加路由
    routerMap.set(menuId, routerInfo);
    // 修改名字
    to.name = menuId;
  }

  // 群组详情
  if ('moments' == to.name ) {
    // 获取菜单
    const menuId = to.params.menuId;
    const userId = to.params.userId;    // 新增：获取userId
    const name = to.name;
    const modules = import.meta.glob('../views/**/**.vue');
    // 添加路由
    routerInfo = {
      path: to.fullPath,
      name: menuId,
      meta: {
        title: to.meta.title,
        menuType: to.meta.menuType,
        ignore: false,
        momentId: menuId, 
        userId: userId 
      },
      component: modules[`../views/friend/` + name + `/index-info.vue`],
    };
    // 添加路由
    router.addRoute('_home', routerInfo);
    // 添加路由
    routerMap.set(menuId, routerInfo);
    // 修改名字
    to.name = menuId;
  }

  // 设置tagNav
  useUserStore().setTagNav(to, from);

  next();
});

// ----------------------- 路由加载后 -----------------------
router.afterEach(() => {
  nProgress.done();
});

// ----------------------- 构建router对象 -----------------------
const routerMap = new Map();

export function buildRoutes(routerList) {
  const modules = import.meta.glob('../views/**/**.vue');
  //1、构建整个路由信息
  for (const route of routerList) {
    if (route.meta.frameFlag) {
      route.component = () => import('../components/framework/iframe/iframe-index.vue');
    } else {
      let component = `../views` + route.meta.component + ".vue";
      route.component = modules[component];
    }
    routerMap.set(route.name, route);
  }
  //2、添加到路由里
  router.addRoute({
    path: '/',
    meta: {},
    component: SmartLayout,
    children: routerList,
  });
}
