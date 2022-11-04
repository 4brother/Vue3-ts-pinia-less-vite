<template>
  <a-popover v-bind="$attrs">
    <template #title>
      <slot name="title" />
    </template>
    <template #content>
      <slot name="content" />
    </template>
    <template #default>
      <span><slot /></span>
      <span>&nbsp;</span>
      <info-circle-outlined />
    </template>
  </a-popover>
</template>
<script lang="ts">
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'InfoTips',
  components: { InfoCircleOutlined },
});
</script>
