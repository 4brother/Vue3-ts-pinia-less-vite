<template>
  <h2>{{ getStr }}</h2>
  <a-button @click="setStrTest">click</a-button>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapState } from 'pinia';
import mainStore from '@/store';
export default defineComponent({
  name: 'TestPage',
  computed: {
    ...mapState(mainStore, ['getStr']),
  },
  methods: {
    ...mapActions(mainStore, ['setStr']),
    setStrTest() {
      this.setStr(String(Math.random()));
    },
  },
});
</script>
