import { createRouter, createWebHashHistory } from 'vue-router';
import BasicLayout from '@/layouts/index.vue';
// import { cloneDeep } from 'lodash';

// import BlankLayout from '@/layouts/BlankLayout.vue';
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: BasicLayout,
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('@/views/Home.vue'),
          meta: { title: 'home' },
        },
        {
          path: '/test',
          name: 'test',
          component: () => import('@/views/Test.vue'),
          meta: { title: 'test' },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('@/views/exception/404.vue'),
      meta: { title: '404' },
    },
  ],
});
router.beforeEach((guard) => {
  if (guard.meta?.title) {
    document.title = guard.meta.title as string;
  }
});

// export const setRouterByRight = (right: number) => {
//   const menuData = [];
//   const fn = (parent: any, children: any[]) => {
//     if (!children) return 0;
//     return children.filter((item) => {
//       const temp = cloneDeep(item);
//       temp.children = [];
//       const curPageHasRight = !item.meta?.right || item.meta?.right?.includes(right);
//       const curAllChildrenPageHasRight = !item.children || fn(temp, item.children);

//       if (curAllChildrenPageHasRight) {
//         if (parent === root) {
//           menuData.push(temp);
//         } else {
//           parent.children.push(temp);
//         }
//       }
//       if (!curPageHasRight) {
//         temp.component = Page403;
//         temp.meta.hidden = true;
//         router.addRoute(parent.name, temp);
//         return false;
//       }
//       if (!curAllChildrenPageHasRight) {
//         router.addRoute(parent.name, temp);
//         return false;
//       };
//       router.addRoute(parent.name, temp);
//       return true;
//     }).length;
//   };
//   fn(root, routes);
//   router.addRoute(route404);
//   router.replace(router.currentRoute.value.fullPath);
//   return menuData;
// };

export default router;
