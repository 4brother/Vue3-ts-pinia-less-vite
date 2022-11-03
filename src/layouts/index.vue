<template>
  <pro-layout
    v-model:openKeys="proLayoutState.openKeys"
    v-model:collapsed="proLayoutState.collapsed"
    v-model:selectedKeys="proLayoutState.selectedKeys"
    :locale="locale"
    v-bind="layoutConf"
  >
    <!-- <template #headerContentRender>
      <a-select
        :value="product.current"
        style="width: 120px"
        placeholder="请选择产品"
        @change="handleChangeProduct"
      >
        <a-select-option
          v-for="item of product.list"
          :key="item"
          :value="item"
        >
          {{ item }}
        </a-select-option>
      </a-select>
    </template> -->
    <a-page-header
      v-bind="pageHeaderBind"
      style="padding: 0;"
    />
    <template #menuItemRender="{ item, icon }">
      <a-menu-item
        v-if="!item.meta?.hidden"
        :key="item.path"
        :disabled="item.meta?.disabled"
        :danger="item.meta?.danger"
        :icon="icon"
      >
        <router-link :to="{ path: getShortPath(item.path) }">
          <span class="ant-pro-menu-item">
            <!-- <a-badge count="5" dot> -->
            <span class="ant-pro-menu-item-title">{{ item.meta?.title }}</span>
            <!-- </a-badge> -->
          </span>
        </router-link>
      </a-menu-item>
    </template>
    <div class="page-container">
      <router-view />
    </div>
  </pro-layout>
</template>

<script setup lang="ts">
import './layout.less';
import { reactive, watch } from 'vue';
import { getMenuData, clearMenuItem } from '@ant-design-vue/pro-layout';
import { useRoute, useRouter } from 'vue-router';
export interface Route {
  path: string;
  breadcrumbName: string;
  meta?: {
    title: string
  }
}

const locale = (i18n: string) => i18n;
const router = useRouter();
const { menuData } = getMenuData(clearMenuItem(router.getRoutes()));
const proLayoutState = reactive({
  collapsed: false, // default value
  openKeys: [],
  selectedKeys: [],
});
const layoutConf = reactive({
  menuData,
  title: '合线工具',
  headerTheme: 'dark',
  navTheme: 'dark',
  layout: 'side',
  splitMenus: false,
});
const route = useRoute() as any;
proLayoutState.openKeys = route.matched.map((item: Route) => item.path);
const pageHeaderBind = reactive({
  breadcrumb: {
    routes: [] as Route[],
  },
  title: '',
});
const getShortPath = (path: string) => path.replace(/\/:\w+\??/g, '');
watch(
  route,
  (val) => {
    try {
      proLayoutState.selectedKeys = [val.matched.slice(-1)[0].path];
      let prePath = '';
      pageHeaderBind.breadcrumb.routes = val.matched.reduce((acc: any, cur: Route) => {
        if (cur.meta?.title) acc.push({ path: prePath ? cur.path.replace(prePath, '') : cur.path, breadcrumbName: cur.meta.title });
        prePath = cur.path;
        return acc;
      }, []);
      const temp = pageHeaderBind.breadcrumb.routes[pageHeaderBind.breadcrumb.routes.length - 1];
      if (temp) pageHeaderBind.title = temp.breadcrumbName;
    } catch (e) {
      proLayoutState.selectedKeys = [];
    }
  },
  { immediate: true },
);
</script>
