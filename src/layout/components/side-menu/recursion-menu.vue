<template>
  <a-menu v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" class="smart-menu" mode="inline"
    :theme="theme" :inlineCollapsed="collapsed" @openChange="onOpenChange">
    <template v-for="item in menuTree" :key="item.menuId">
      <template v-if="$lodash.isEmpty(item.children)">
        <a-menu-item :key="item.menuId" @click="turnToPage(item)">
          <template #icon>
            <component :is="$antIcons[item.icon]" />
          </template>
          {{ item.menuName }}
        </a-menu-item>
      </template>
      <template v-else>
        <SubMenu :menu-info="item" :key="item.menuId" @turnToPage="turnToPage" />
      </template>
    </template>
  </a-menu>
</template>
<script setup>
import _ from 'lodash';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import SubMenu from './sub-menu.vue';
import { router } from '/@/router/index';
import { useAppConfigStore } from '/@/store/config';
import { useUserStore } from '/@/store/user';

const theme = computed(() => useAppConfigStore().$state.sideMenuTheme);

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
});

const menuTree = computed(() => useUserStore().getMenuTree || []);

//展开的菜单
let currentRoute = useRoute();
const selectedKeys = ref([]);
const openKeys = ref([]);

// 页面跳转
function turnToPage(menu) {
  // 立即设置选中状态，不等待路由变化
  selectedKeys.value = [menu.menuId.toString()];
  
  // 查找当前菜单的父级菜单ID
  const findParentMenu = (menus, targetPath, parent = null) => {
    for (const menu of menus) {
      if (menu.path === targetPath) {
        return parent ? parent.menuId : null;
      }
      if (menu.children) {
        const result = findParentMenu(menu.children, targetPath, menu);
        if (result) return result;
      }
    }
    return null;
  };

  // 获取当前点击菜单的父级菜单ID
  const parentMenuId = findParentMenu(menuTree.value, menu.path);
  if (parentMenuId) {
    // 只保留当前子菜单的父级菜单展开
    openKeys.value = [parentMenuId.toString()];
  }

  // 最后再进行路由跳转
  router.push({ path: menu.path });
}

/**
 * SmartAdmin中 router的name 就是 后端存储menu的id
 * 所以此处可以直接监听路由，根据路由更新菜单的选中和展开
 */
function updateOpenKeysAndSelectKeys() {
  // 更新选中
  selectedKeys.value = currentRoute.name ? [currentRoute.name.toString()] : [];

  // 如果是折叠菜单的话，则不需要设置openkey
  if (!props.collapsed) {
    // 查找当前路由对应的菜单项及其所有父级菜单
    const findParentMenus = (menus, targetName, parents = []) => {
      for (const menu of menus) {
        if (_.toNumber(menu.menuId) === _.toNumber(currentRoute.name)) {
          return [...parents, menu.menuId.toString()];
        }
        if (menu.children) {
          const result = findParentMenus(menu.children, targetName, [...parents, menu.menuId.toString()]);
          if (result) return result;
        }
      }
      return null;
    };

    const parentMenus = findParentMenus(menuTree.value, currentRoute.name);
    if (parentMenus) {
      // 设置当前路由对应的父级菜单为展开状态
      openKeys.value = parentMenus;
    }
  }
}

// 添加菜单点击处理函数
const onOpenChange = (keys) => {
  // 获取最后点击的菜单项
  const latestOpenKey = keys.find(key => !openKeys.value.includes(key));
  
  if (latestOpenKey) {
    // 获取当前展开的所有父级菜单
    const allParentMenus = keys.filter(key => {
      // 检查是否为父级菜单（有子菜单的菜单项）
      const isParentMenu = menuTree.value.some(menu => {
        if (menu.menuId.toString() === key) {
          return menu.children && menu.children.length > 0;
        }
        if (menu.children) {
          return menu.children.some(child => 
            child.menuId.toString() === key && 
            child.children && 
            child.children.length > 0
          );
        }
        return false;
      });
      return isParentMenu;
    });

    // 如果点击的是父级菜单，实现手风琴效果
    if (allParentMenus.includes(latestOpenKey)) {
      openKeys.value = [latestOpenKey];
      // 查找该父级菜单下的第一个子菜单并选中
      const parentMenu = menuTree.value.find(menu => menu.menuId.toString() === latestOpenKey);
      if (parentMenu && parentMenu.children && parentMenu.children.length > 0) {
        const firstChild = parentMenu.children[0];
        selectedKeys.value = [firstChild.menuId.toString()];
        router.push({ path: firstChild.path });
      }
    } else {
      // 如果点击的不是父级菜单，保持当前展开状态
      openKeys.value = keys;
    }
  } else {
    // 如果是收起操作，保留其他展开的菜单
    openKeys.value = keys;
  }
};

// 监听路由变化
watch(
  currentRoute,
  () => {
    // 只在路由实际改变时更新选中状态
    if (!selectedKeys.value.includes(_.toNumber(currentRoute.name))) {
      updateOpenKeysAndSelectKeys();
    }
  },
  {
    immediate: true,
  }
);

defineExpose({
  updateOpenKeysAndSelectKeys,
});
</script>

<style lang="less" scoped>
.smart-menu {
  position: relative;
}
</style>
