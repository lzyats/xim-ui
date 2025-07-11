/*
 * 登录用户
 */
import _ from 'lodash';
import { defineStore } from 'pinia';
import localKey from '/@/constants/local-storage-key-const';
import { HOME_PAGE_NAME } from '/@/constants/sys/home-const';
import { localClear, localRead, localSave } from '/@/lib/local-util';
import LocalStorageKeyConst from '/@/constants/local-storage-key-const';
import { indexApi } from '/@/api/sys/index-api';
import { buildRoutes } from '/@/router';

export const useUserStore = defineStore({
  id: 'userStore',
  state: () => ({
    token: '',
    //姓名
    username: '',
    //左侧菜单树形结构
    menuTree: [],
    //存在页面路由的菜单集合
    menuRouter: [],
    // 功能点集合
    pointsList: [],
    // 标签页
    tagNav: null,
  }),
  getters: {
    getToken(state) {
      if (state.token) {
        return state.token;
      }
      return localRead(LocalStorageKeyConst.USER_TOKEN);
    },
    //菜单树
    getMenuTree(state) {
      return state.menuTree;
    },
    //菜单的路由
    getMenuRouter(state) {
      return state.menuRouter;
    },
    //功能点
    getPointList() {
      return this.pointsList;
    },
    //标签页
    getTagNav(state) {
      if (_.isNull(state.tagNav)) {
        let localTagNav = localRead(localKey.USER_TAG_NAV) || '';
        state.tagNav = localTagNav ? JSON.parse(localTagNav) : [];
      }
      let tagNavList = _.cloneDeep(state.tagNav) || [];
      tagNavList.unshift({
        menuName: HOME_PAGE_NAME,
        menuTitle: '首页',
      });
      return tagNavList;
    },
  },
  actions: {
    logout() {
      this.token = '';
      this.menuList = [];
      this.tagNav = [];
      localClear();
    },
    async setToken(token) {
      this.token = token;
      localSave(LocalStorageKeyConst.USER_TOKEN, token);
      // 信息
      this.setInfo(await indexApi.getInfo());
      // 菜单
      this.setMenus(await indexApi.getMenus());
      // 路由
      const result = await indexApi.getRouters()
      this.menuRouter = result.data;
      buildRoutes(result.data);
    },
    //登录信息
    setInfo(result) {
      // 用户信息
      this.username = result.data.data.username;
      // 权限信息
      this.pointsList = result.data.perms;
    },
    //菜单信息
    async setMenus(result) {
      this.menuTree = result.data;
    },
    //路由信息
    setRouters(menuRouter) {
      this.menuRouter = menuRouter;
    },
    //设置标签页
    setTagNav(route, from) {
      if (_.isNull(this.tagNav)) {
        let localTagNav = localRead(localKey.USER_TAG_NAV) || '';
        this.tagNav = localTagNav ? JSON.parse(localTagNav) : [];
      }
      // name唯一标识
      let name = route.name;
      if (!name || name === HOME_PAGE_NAME || name === '403' || name === '404') {
        return;
      }
      let findTag = (this.tagNav || []).find((e) => e.menuName === name);
      if (findTag) {
        // @ts-ignore
        findTag.fromMenuName = from.name;
        findTag.fromMenuQuery = from.query;
      } else {
        // @ts-ignore
        this.tagNav.push({
          // @ts-ignore
          menuName: name,
          // @ts-ignore
          menuTitle: route.meta.title,
          menuQuery: route.query,
          // @ts-ignore
          fromMenuName: from.name,
          fromMenuQuery: from.query,
        });
      }
      localSave(localKey.USER_TAG_NAV, JSON.stringify(this.tagNav));
    },
    //关闭标签页
    closeTagNav(menuName, closeAll) {
      if (_.isEmpty(this.getTagNav)) return;
      if (closeAll && !menuName) {
        this.tagNav = [];
      } else {
        let findIndex = (this.tagNav || []).findIndex((e) => e.menuName === menuName);
        if (closeAll) {
          if (findIndex === -1) {
            this.tagNav = [];
          } else {
            let tagNavElement = (this.tagNav || [])[findIndex];
            this.tagNav = [tagNavElement];
          }
        } else {
          (this.tagNav || []).splice(findIndex, 1);
        }
      }
      localSave(localKey.USER_TAG_NAV, JSON.stringify(this.tagNav));
    },
    //关闭页面
    closePage(route, router, path) {
      if (!this.getTagNav || _.isEmpty(this.getTagNav)) return;
      if (path) {
        router.push({ path });
      } else {
        // 寻找tagNav
        let index = this.getTagNav.findIndex((e) => e.menuName === route.name);
        if (index === -1) {
          router.push({ name: HOME_PAGE_NAME });
        } else {
          let tagNav = this.getTagNav[index];
          if (tagNav.fromMenuName && this.getTagNav.some((e) => e.menuName === tagNav.fromMenuName)) {
            router.push({ name: tagNav.fromMenuName, query: tagNav.fromMenuQuery });
          } else {
            // 查询左侧tag
            let leftTagNav = this.getTagNav[index - 1];
            router.push({ name: leftTagNav.menuName, query: leftTagNav.menuQuery });
          }
        }
      }
      this.closeTagNav(route.name, false);
    },
  },
});