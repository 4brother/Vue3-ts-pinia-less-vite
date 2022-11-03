import { defineStore } from 'pinia';
declare type State = {
  str: string,
  obj: any,
};
export default defineStore('main', {
  state: (): State => ({
    str: '',
    obj: {},
  }),
  getters: {
    getStr: (state: State) => state.str,
    getObj: (state: State) => state.obj,
  },
  actions: {
    setStr(data: string) {
      this.str = data;
    },
  },
});
