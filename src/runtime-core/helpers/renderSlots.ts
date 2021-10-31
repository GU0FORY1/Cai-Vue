import { createVNode } from "../vnode";

export function renderSlots(slots, name, props) {
  const slot = slots[name];
  if (slot) {
    if (typeof slot === "function") {
      //实现数组渲染 把数组转换为一个虚拟节点 chilren支持传入数组
      return createVNode("div", {}, slot(props));
    }
  }
}
