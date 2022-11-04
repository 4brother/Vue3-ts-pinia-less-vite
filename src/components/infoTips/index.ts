import { h } from 'vue';
import { Popover } from 'ant-design-vue';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
export default (text: any, content: any) => (
  h(Popover, null, {
    default: () => h('span', null, [
      text,
      h('span', null, ' '),
      h(InfoCircleOutlined),
    ]),
    content: () => content,
  })
);
