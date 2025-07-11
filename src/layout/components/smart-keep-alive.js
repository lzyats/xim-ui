/*
 * keep-alive
 */
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '/@/store/user';

export function smartKeepAlive() {
  const route = useRoute();
  const router = useRouter();

  // ----------------------- iframe相关 -----------------------

  // 当前路由是否为不需要缓存的iframe页面
  const iframeFlag = computed(() => route.meta.frameFlag);
  // 打开中的tagNav
  const tagNav = computed(() => useUserStore().getTagNav || []);
  // 已打开的iframe列表
  const iframePages = computed(() => {
    let routes = router.getRoutes();
    return routes.filter((e) => e.meta.frameFlag && tagNav.value.some((t) => t.menuName == e.name));
  });

  return {
    route,
    iframeFlag,
    iframePages,
  };
}
