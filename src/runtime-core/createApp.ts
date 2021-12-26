import { createVNode } from "./vnode";
//为了传入render
export function createAppApi(render) {
  return function createApp(rootComponent) {
    return {
      mount(rootContainer) {
        // 先转换成vnode
        const vnode = createVNode(rootComponent);
        //然后渲染
        render(vnode, rootContainer);
      },
    };
  };
}
