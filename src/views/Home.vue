<template>
  <div>home</div>
  <h2>{{ getStr }}</h2>
  <a-button type="primary">12312312312321313</a-button>
  <a-button>Default Button</a-button>
  <a-button type="dashed">Dashed Button</a-button>
  <a-button type="text">Text Button</a-button>
  <a-button type="link">Link Button</a-button>
  <a-space direction="vertical" :size="12">
    <a-date-picker v-model:value="value1" />
    <a-date-picker v-model:value="value2" picker="week" />
    <a-date-picker v-model:value="value3" picker="month" />
    <a-date-picker v-model:value="value4" picker="quarter" />
    <a-date-picker v-model:value="value5" picker="year" />
  </a-space>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { Dayjs } from 'dayjs';
import { mapActions, mapState } from 'pinia';
import mainStore from '@/store';
export default defineComponent({
  setup() {
    return {
      value1: ref<Dayjs>(),
      value2: ref<Dayjs>(),
      value3: ref<Dayjs>(),
      value4: ref<Dayjs>(),
      value5: ref<Dayjs>(),
    };
  },
  computed: {
    ...mapState(mainStore, ['getStr']),
  },
  mounted() {
    // this.setStr('123');
  },
  methods: {
    ...mapActions(mainStore, ['setStr']),
  },
});
</script>
