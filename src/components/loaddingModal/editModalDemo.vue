<template>
  <loading-modal
    :visible="visible"
    :loading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form
      ref="formRef"
      :model="formData"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 16 }"
      :rules="rules"
      autocomplete="off"
    >
      <a-form-item
        label="IP"
        name="ip"
      >
        <a-input v-model:value="formData.ip" />
      </a-form-item>
    </a-form>
  </loading-modal>
</template>
<script lang="ts">
import loadingModal from '@/components/loaddingModal/index.vue';
import { defineComponent, PropType } from 'vue';
export default defineComponent({
  name: 'EditModalDemo',
  components: {
    loadingModal,
  },
  props: {
    visible: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    data: {
      type: Object as PropType<{ ip: string, op: 1 | 0 }>,
      default: () => ({}),
    },
    loading: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  emits: ['update:visible', 'submit'],
  data() {
    return {
      formData: {
        ip: void 0,
        op: 1,
      },
      rules: {
        ip: { required: true, message: '请输入IP！' },
      },
    };
  },
  watch: {
    visible(val) {
      if (val) {
        Object.assign(this.formData, val);
      } else {
        Object.assign(this.$data, this.$options.data());
        this.$refs.formRef.clearValidate();
      }
    },
  },
  methods: {
    handleOk() {
      this.$refs.formRef.validate().then(() => {
        this.$emit('submit', this.formData);
      });
    },
    handleCancel() {
      this.$emit('update:visible', false);
    },
  },
});
</script>
