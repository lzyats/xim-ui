/*
 * 所有路由入口
 */
import { homeRouters } from './home';
import { loginRouters } from './login';
import NotFound from '/@/views/sys/40X/404.vue';
import NoPrivilege from '/@/views/sys/40X/403.vue';

export const routerArray = [
    ...loginRouters,
    ...homeRouters,
    { path: '/:pathMatch(.*)*', name: '404', component: NotFound },
    { path: '/403', name: '403', component: NoPrivilege }
];
