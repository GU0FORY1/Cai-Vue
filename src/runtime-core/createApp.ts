import { render } from "./renderer";
import { createVNode } from "./vnode";

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      // 先转换成vnode
      const vnode = createVNode(rootComponent);
      //然后渲染
      render(vnode, rootContainer);
    },
  };
}
