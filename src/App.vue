<template>
  <a-config-provider v-bind="config">
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
export default defineComponent({
  name: 'App',
  setup() {
    return {
      config: {
        componentSize: 'middle',
        locale: zhCN,
      },
    };
  },
});
</script>