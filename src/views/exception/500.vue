<template>
  <a-result
    status="500"
    title="500"
    sub-title="Sorry, the server is reporting an error."
  >
    <template #extra>
      <a-button
        type="primary"
        @click="toHome"
      >
        Back Home
      </a-button>
    </template>
  </a-result>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'ExceptionIs500',
  methods: {
    toHome() {
      this.$router.push({ path: '/' });
    },
  },
});
</script>
