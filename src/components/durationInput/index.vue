<template>
  <a-input-group
    class="duration-input"
    compact
  >
    <template
      v-for="(val, key) in formatMap"
      :key="key"
    >
      <a-input
        :ref="key"
        class="input-item"
        :default-value="valOpt[key]"
        :suffix="val.unit"
        type="number"
        @blur="onBlur($event, key)"
      />
    </template>
  </a-input-group>
</template>
<script lang="ts">
import { defineComponent, nextTick, PropType } from 'vue';
import { Form } from 'ant-design-vue';
const map = {
  d: {
    unit: '天',
  },
  h: {
    unit: '小时',
  },
  m: {
    unit: '分钟',
  },
  s: {
    unit: '秒',
  },
};
export default defineComponent({
  name: 'DurationInput',
  props: {
    value: {
      type: Number as PropType<number>,
      default: 0,
    },
    format: {
      type: String as PropType<'d' | 'd-h' | 'd-h-m' | 'd-h-m-s'>,
      default: 'd-h-m-s',
    },
  },
  emits: ['update:value', 'change'],
  setup() {
    const formItemContext = Form.useInjectFormItemContext();
    return { formItemContext };
  },
  data() {
    return {
      map: Object.freeze({
        d: {
          unit: '天',
        },
        h: {
          unit: '小时',
        },
        m: {
          unit: '分钟',
        },
        s: {
          unit: '秒',
        },
      }),
    };
  },
  computed: {
    formatMap(): Record<'d' | 'h' | 'm' | 's', any> {
      return this.format.split('-').reduce((acc, cur) => {
        Reflect.set(acc, cur, map[cur]);
        return acc;
      }, {});
    },
    valOpt(): { d: number, h: number, m: number, s: number } {
      const val: number = this.value;
      return {
        d: ~~(val / 86400),
        h: ~~((val % 86400) / 3600),
        m: ~~((val % 3600) / 60),
        s: ~~(val % 60),
      };
    },
  },
  watch: {
    valOpt(val) {
      nextTick(() => {
        Object.entries(val).forEach((item) => {
          const [k, v] = item;
          const inputDom = this.$refs[k]?.[0].input;
          if (inputDom) {
            inputDom.value = v;
            inputDom.dispatchEvent(new Event('input'));
          }
        });
        this.formItemContext.onFieldChange();
      });
    },
  },
  methods: {
    onBlur(e: any, key: 'd' | 'h' | 'm' | 's') {
      const value = +e.target.value;
      const newVal = Object.entries(this.valOpt).reduce((acc, cur: [string, number]) => {
        const [k, v] = cur;
        switch (k) {
          case 'd': {
            if (key === k) return acc + value * 86400;
            return acc + v * 86400;
          }
          case 'h': {
            if (key === k) return acc + value * 3600;
            return acc + v * 3600;
          }
          case 'm': {
            if (key === k) return acc + value * 60;
            return acc + v * 60;
          }
          case 's': {
            if (key === k) return acc + value;
            return acc + v;
          }
          default: return acc;
        }
      }, 0);
      this.$emit('update:value', newVal);
      this.$emit('change', newVal);
      this.formItemContext.onFieldBlur();
    },
  },
});
</script>
<style lang="less">
.duration-input {
  display: flex !important;
  .input-item {
    flex-grow: 1;
    flex-shrink: 0;
    width: 0;
  }
}
</style>
