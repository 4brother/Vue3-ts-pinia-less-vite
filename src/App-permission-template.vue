<template>
  <a-config-provider v-bind="config">
    <div class="root">
      <template v-if="userInfoLoaded">
        <template v-if="userInfo.right">
          <router-view />
        </template>
        <template v-else>
          <page403 :is-project="true" />
        </template>
      </template>
      <template v-else>
        <a-spin
          class="loading"
          tip="Loading..."
          size="large"
        />
      </template>
    </div>
  </a-config-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapState } from 'pinia';
import mainStore from '@/store';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import page403 from '@/views/exception/403.vue';
export default defineComponent({
  name: 'App',
  components: { page403 },
  setup() {
    return {
      config: {
        componentSize: 'middle',
        locale: zhCN,
      },
    };
  },
  computed: {
    ...mapState(mainStore, ['userInfo', 'userInfoLoaded']),
  },
  created() {
    this.getLogin().then(() => {
      this.getUserList();
    });
  },
  methods: {
    ...mapActions(mainStore, ['getUserList', 'getLogin']),
  },
});
</script>
