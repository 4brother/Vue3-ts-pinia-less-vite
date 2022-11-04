<template>
  <h2>{{ getStr }}</h2>
  <a-button @click="setStrTest">
    click
  </a-button>
  <duration-input
    v-model:value="durationInputVal"
  />
  <div :style="{ background: '#ffffff', height: '500px'}">
    <draggableTable
      v-bind="draggableTableData"
      v-model:data-source="draggableTableData.dataSource"
      :on-drag="onDrag"
    >
      <template #headerCell>
        <!-- 123 -->
        <!-- <span>123</span> -->
      </template>
      <template #bodyCell>
        <!-- <div>123</div> -->
      </template>
    </draggableTable>
  </div>
  <div>{{ draggableTableData.dataSource }}</div>
  <infoTips>
    <template #content>
      content
    </template>
    tips
  </infoTips>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapState } from 'pinia';
import mainStore from '@/store';
import durationInput from '@/components/durationInput/index.vue';
import draggableTable from '@/components/draggableTable/index.vue';
import infoTips from '@/components/infoTips/index.vue';
export default defineComponent({
  name: 'TestPage',
  components: {
    durationInput,
    draggableTable,
    infoTips,
  },
  data() {
    return {
      durationInputVal: 0,
      draggableTableData: {
        columns: [
          {
            dataIndex: 'id',
            title: 'id',
            width: 200,
            fixed: 'left',
          },
          {
            dataIndex: 'id1',
            title: 'id1',
            width: 200,
          },
          {
            dataIndex: 'id2',
            title: 'id2',
            width: 200,
          },
          {
            dataIndex: 'name',
            title: 'name',
            width: 200,
            fixed: 'right',
          },
          {
            dataIndex: 'age',
            title: 'age',
            width: 200,
            fixed: 'right',
          },
        ],
        dataSource: Array.from({ length: 20 }, (v, k) => ({ id: k + 1, name: `Name_${k}`, age: 18 })),
        rowKey: 'id',
      },
    };
  },
  computed: {
    ...mapState(mainStore, ['getStr']),
  },
  methods: {
    ...mapActions(mainStore, ['setStr']),
    setStrTest() {
      this.setStr(String(Math.random()));
    },
    onDrag() {
      return true;
    },
  },
});
</script>
