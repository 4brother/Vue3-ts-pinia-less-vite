<template>
  <a-modal
    :visible="visible"
    :title="title"
    :mask-closable="!loading"
    :closable="!loading"
    @cancel="handleCancel"
  >
    <a-spin
      :spinning="loading"
      tip="Loading..."
    >
      <slot />
    </a-spin>
    <template #footer>
      <a-button
        key="back"
        :disabled="loading"
        @click="handleCancel"
      >
        取消
      </a-button>
      <a-button
        key="submit"
        type="primary"
        :loading="loading"
        @click="handleOk"
      >
        确认
      </a-button>
    </template>
  </a-modal>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
export default defineComponent({
  name: 'LoaddingModal',
  props: {
    title: {
      type: String as PropType<string>,
      default: 'Title',
    },
    visible: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    loading: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  emits: ['ok', 'cancel'],
  methods: {
    handleOk() {
      this.$emit('ok');
    },
    handleCancel() {
      this.$emit('cancel');
    },
  },
});
</script>
