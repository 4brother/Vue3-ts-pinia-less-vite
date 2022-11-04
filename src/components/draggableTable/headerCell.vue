<script lang="ts">
import { defineComponent, PropType, h, VNode, Comment } from 'vue';
import { TableColumn } from './index.vue';

export default defineComponent({
  name: 'DraggableTableHeaderCell',
  inject: ['parent'],
  props: {
    column: {
      type: Object as PropType<TableColumn>,
      required: true,
    },
    index: {
      type: Number as PropType<Number>,
      required: true,
    },
  },
  render() {
    const { column, index } = this;
    const { title } = column as TableColumn;
    const { headerCell } = this.parent.$slots;
    let vNode = title;
    if (headerCell) {
      const value = headerCell({ title, column, index });
      if (value.length && value.some((item: VNode) => item.type !== Comment)) vNode = value;
    }
    let { style } = column as TableColumn;
    if (style?.right) {
      style = {
        ...style,
        right: `${parseFloat(style.right) + 17}px`,
      };
    }
    return h('th', {
      class: column.class,
      style: {
        ...style,
      },
    }, {
      default: () => vNode,
    });
  },
});
</script>
