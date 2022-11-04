<script lang="ts">
import { defineComponent, PropType, h, VNode, Comment } from 'vue';
import { TableColumn } from './index.vue';

export default defineComponent({
  name: 'DraggableTableBodyCell',
  inject: ['parent'],
  props: {
    column: {
      type: Object as PropType<TableColumn>,
      required: true,
    },
    record: {
      type: Object as PropType<any>,
      required: true,
    },
    index: {
      type: Number as PropType<Number>,
      required: true,
    },
  },
  render() {
    const { column, record, index } = this;
    const { dataIndex, style } = column as TableColumn;
    const text = record[dataIndex];
    const { bodyCell } = this.parent.$slots;
    let vNode = text;
    if (bodyCell) {
      const value = bodyCell({ text, record, column, index });
      if (value.length && value.some((item: VNode) => item.type !== Comment)) vNode = value;
    }
    return h('td', {
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
