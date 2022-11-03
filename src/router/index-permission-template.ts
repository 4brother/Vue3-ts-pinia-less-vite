import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import BasicLayout from '@/layouts/index.vue';
import BlankLayout from '@/layouts/BlankLayout.vue';
import Page403 from '@/views/exception/403.vue';
import { cloneDeep } from 'lodash';
export const ADMIN_RIGHT = 2;
export const USER_RIGHT = 1;
const routes: RouteRecordRaw[] = [
  {
    path: '/home',
    name: 'Home',
    component: BlankLayout,
    meta: { title: 'home' },
    children: [
      {
        path: '/test',
        name: 'Test',
        component: () => import('@/views/Test.vue'),
        meta: { title: 'test', right: [ADMIN_RIGHT] },
      },
    ],
  },
];
const route404: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: '404',
  component: () => import('@/views/exception/404.vue'),
  meta: { title: '404' },
};
const root: RouteRecordRaw = {
  path: '/',
  name: 'index',
  component: BasicLayout,
  children: [],
};
const router = createRouter({
  history: createWebHashHistory(),
  routes: [root],
});
router.beforeEach((guard) => {
  if (guard.meta?.title) {
    document.title = `${import.meta.env.VITE_APP_TITLE} - ${guard.meta.title}`;
  }
});

export const setRouterByRight = (right: number) => {
  const menuData = [];
  const fn = (parent: any, children: any[]) => {
    if (!children) return 0;
    return children.filter((item) => {
      const temp = cloneDeep(item);
      temp.children = [];
      const curPageHasRight = !item.meta?.right || item.meta?.right?.includes(right);
      const curAllChildrenPageHasRight = !item.children || fn(temp, item.children);

      if (curAllChildrenPageHasRight) {
        if (parent === root) {
          menuData.push(temp);
        } else {
          parent.children.push(temp);
        }
      }
      if (!curPageHasRight) {
        temp.component = Page403;
        temp.meta.hidden = true;
        router.addRoute(parent.name, temp);
        return false;
      }
      if (!curAllChildrenPageHasRight) {
        router.addRoute(parent.name, temp);
        return false;
      };
      router.addRoute(parent.name, temp);
      return true;
    }).length;
  };
  fn(root, routes);
  router.addRoute(route404);
  router.replace(router.currentRoute.value.fullPath);
  return menuData;
};

export default router;
