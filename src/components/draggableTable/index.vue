<template>
  <div
    ref="draggableTableRef"
    class="draggable-table"
    :class="ownerClass"
  >
    <div
      ref="tableHeaderRef"
      class="draggable-table-header"
    >
      <table
        cellpadding="8"
        cellspacing="0"
        :style="style"
      >
        <colgroup>
          <col
            v-for="column in tableColumn"
            :key="column.dataIndex"
            :style="{ width: `${column.width}px`}"
          >
        </colgroup>
        <thead>
          <tr>
            <template
              v-for="(column, index) in tableColumn"
              :key="column.dataIndex"
            >
              <headerCell
                :column="column"
                :index="index"
              />
            </template>
          </tr>
        </thead>
      </table>
      <span class="scroll-offset" />
    </div>
    <div
      ref="tableBodyRef"
      class="draggable-table-body"
    >
      <table
        :style="style"
        cellpadding="8"
        cellspacing="0"
      >
        <caption
          v-if="!ownDataSource.length"
          :style="{
            width: `${containerWidth - 17}px`,
          }"
        >
          <a-empty
            :image="simpleImage"
          />
        </caption>
        <colgroup>
          <col
            v-for="column in tableColumn"
            :key="column.dataIndex"
            :style="{ width: `${column.width}px`}"
          >
        </colgroup>
        <draggable
          v-model="ownDataSource"
          :item-key="rowKey"
          :animation="60"
          tag="tbody"
          :move="onMove"
          @start="onStart"
          @end="onEnd"
        >
          <template #item="{ element: record }">
            <tr
              :class="{ active: activeKey !== void 0 && record[rowKey] === activeKey }"
              @mousedown="onTBRowMousedown(record)"
            >
              <template
                v-for="(column, index) in tableColumn"
                :key="column.dataIndex"
              >
                <bodyCell
                  :column="column"
                  :record="record"
                  :index="index"
                />
              </template>
            </tr>
          </template>
        </draggable>
      </table>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import draggable from 'vuedraggable';
import headerCell from './headerCell.vue';
import bodyCell from './bodyCell.vue';
import { debounce } from 'lodash';
import { Empty } from 'ant-design-vue';
export declare type Column = {
  dataIndex: string,
  title: string,
  width?: number,
  fixed?: 'left' | 'right' | void,
};
export declare type TableColumn = {
  style?: Record<string, string>,
  class?: string,
} & Column;
export default defineComponent({
  name: 'DraggableTable',
  components: {
    draggable,
    headerCell,
    bodyCell,
  },
  provide() {
    return {
      parent: this,
    };
  },
  props: {
    columns: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    dataSource: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    rowKey: {
      type: String as PropType<string>,
      default: void 0,
    },
    scroll: {
      type: Object as PropType<{ x: any, y: any }>,
      default: () => ({
        x: void 0,
        y: void 0,
      }),
    },
    beforeDrag: {
      type: Function as PropType<(record: any) => boolean>,
      default: void 0,
    },
    onDrag: {
      type: Function as PropType<(e: any) => boolean | Promise<boolean>>,
      default: void 0,
    },
  },
  emits: ['update:dataSource', 'change'],
  setup() {
    return {
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
    };
  },
  data() {
    return {
      ownDataSource: [],
      ownerClass: {
        'show-fixed-left-box-shadow': false,
        'show-fixed-right-box-shadow': false,
      },
      RB: void 0,
      activeKey: void 0,
      containerWidth: 0,
      canMove: true,
    };
  },
  computed: {
    tableColumn(): TableColumn[] {
      const left = {
        columns: [],
        sum: 0,
      };
      const center = [];
      const rightColumns = [];
      this.columns.forEach((column: Column) => {
        const { fixed, width } = column;
        if (fixed === 'left') {
          left.columns.push({
            ...column,
            class: 'fixed-left',
            style: {
              position: 'sticky',
              left: `${left.sum}px`,
            },
          });
          left.sum += width;
        } else if (fixed === 'right') {
          rightColumns.push({ ...column });
        } else {
          center.push(column);
        }
      });
      const leftColumnsLen = left.columns.length;
      // 标记左侧最后一个固定列
      if (leftColumnsLen) left.columns[leftColumnsLen - 1].class += ' fixed-left-last';
      const right = {
        columns: [],
        sum: 0,
      };
      for (let i = rightColumns.length - 1; i >= 0; i--) {
        const column = rightColumns[i];
        Object.assign(column, {
          class: 'fixed-right',
          style: {
            position: 'sticky',
            right: `${right.sum}px`,
          },
        });
        right.columns.unshift(column);
        right.sum += column.width;
      }
      // 标记右侧第一个固定列
      if (right.columns[0]) right.columns[0].class += ' fixed-right-first';
      return left.columns.concat(center, right.columns);
    },
    style() {
      return {
        width: `${parseInt(this.scroll.x, 10)}px`,
      };
    },
  },
  watch: {
    dataSource: {
      handler() {
        this.reset();
      },
      immediate: true,
    },
  },
  mounted() {
    const { draggableTableRef, tableHeaderRef, tableBodyRef } = this.$refs;
    const fn = () => {
      const { offsetWidth, scrollWidth, scrollLeft } = tableBodyRef;
      Reflect.set(this.ownerClass, 'show-fixed-left-box-shadow', !!scrollLeft);
      Reflect.set(this.ownerClass, 'show-fixed-right-box-shadow', offsetWidth + scrollLeft !== scrollWidth + 17);
    };
    const arr = [tableHeaderRef, tableBodyRef];
    let sign = 0;
    arr.forEach((item) => {
      Reflect.set(item, 'onscroll', (e: any) => {
        if (!sign) {
          sign = 1;
          for (const node of arr) {
            if (node === e.target) continue;
            node.scrollLeft = e.target.scrollLeft;
            fn();
          }
        } else sign -= 1;
      });
    });
    this.RB = new ResizeObserver(debounce(() => {
      fn();
      this.containerWidth = draggableTableRef.offsetWidth;
    }, 100));
    this.RB.observe(draggableTableRef);
  },
  beforeUnmount() {
    this.RB.disconnect();
  },
  methods: {
    onMove() {
      return this.canMove;
    },
    onStart(e: any) {
      const record = this.ownDataSource[e.oldIndex];
      if (this.beforeDrag) this.canMove = this.beforeDrag(record);
      else this.canMove = true;
    },
    onEnd(e: any) {
      const { oldIndex, newIndex } = e;
      if (oldIndex === newIndex) return;
      const { onDrag } = this;
      if (!onDrag) {
        this.change();
        return;
      };
      const cur = this.ownDataSource[newIndex];
      const pre = this.ownDataSource[newIndex - 1];
      const data = onDrag(cur, pre);
      if (data instanceof Promise) {
        data.then(() => {
          this.change();
        }).catch(() => {
          this.reset();
          console.log('拖拽失败，重置数据');
        });
      } else {
        if (data) this.change();
        else this.reset();
      }
    },
    change() {
      this.$emit('update:dataSource', this.ownDataSource);
      this.$emit('change', this.ownDataSource);
    },
    reset() {
      this.ownDataSource = [...this.dataSource];
    },
    onTBRowMousedown(record: any) {
      const { rowKey } = this;
      this.activeKey = record[rowKey];
    },
  },
});
</script>
<style lang="less">
.draggable-table {
  @border: 1px solid #f0f0f0;
  @THBackground: #fafafa;
  @TBBackground: #ffffff;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: @border;
  .fixed-left {
    &.fixed-left-last {
      &::after {
        position: absolute;
        top: 0;
        right: 0;
        width: 30px;
        height: 100%;
        transform: translateX(100%);
        transition: box-shadow 0.3s;
        content: '';
        pointer-events: none;
      }
    }
  }
  .fixed-right {
    &.fixed-right-first {
      &::after {
        position: absolute;
        top: 0;
        left: 0;
        width: 30px;
        height: 100%;
        transform: translateX(-100%);
        transition: box-shadow 0.3s;
        content: '';
        pointer-events: none;
    }
    }
  }
  &.show-fixed-left-box-shadow {
    .fixed-left {
      &.fixed-left-last {
        &::after {
          box-shadow: inset 10px 0 8px -8px rgba(0, 0, 0, .15);
        }
      }
    }
  }
  &.show-fixed-right-box-shadow {
    .fixed-right {
      &.fixed-right-first {
        &::after {
          box-shadow: inset -10px 0 8px -8px rgba(0, 0, 0, .15);
        }
      }
    }
  }
  table {
    width: calc(100% - 17px);;
    table-layout: fixed;
    border-collapse: collapse;
    flex-shrink: 0;
    th, td {
      text-align: left;
    }
  }
  .draggable-table-header {
    overflow: hidden;
    flex-shrink: 0;
    display: flex;
    background: @THBackground;
    table {
      min-width: calc(100% - 17px);
      background: @THBackground;
      thead {
        tr {
          border-bottom: @border;
          th {
            background: @THBackground;
            font-weight: 500;
            &.fixed-left, &.fixed-right {
              outline: @border;
            }
            &:not(.fixed-left, .fixed-right) {
              border-left: @border;
            }
          }
        }
      }
    }
    .scroll-offset {
      background: @THBackground;
      padding: 0 8.5px;
      position: sticky;
      top: 0;
      right: 0;
    }
  }
  .draggable-table-body {
    // flex-grow: 1;
    min-height: 150px;
    overflow: auto scroll;
    background: @TBBackground;
    table {
      min-width: 100%;
      caption {
        position: sticky;
        top: 0;
        left: 0px;
        padding: 16px;
        margin: 0;
      }
      tbody {
        tr {
          cursor: ns-resize;
          &:not(:last-child) {
            border-bottom: @border;
          }
          &:hover {
            td {
              background: #fafafa !important;
            }
          }
          &.active {
            td {
              background: #dbeeff !important;
            }
          }
          td {
            background: @TBBackground;
            transition: background .3s;
            &.fixed-left, &.fixed-right {
              outline: @border;
            }
            &:not(.fixed-left, .fixed-right) {
              border-left: @border;
            }
          }
        }
      }
    }
  }
}
</style>
