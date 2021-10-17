import { ShapeFlags } from "../shared/";

export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    shapeFlag: getShapeFlags(type),
    el: null,
  };

  if (typeof children === "string") {
    vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.TEXT_CHILDREN;
  } else if (Array.isArray(children)) {
    vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.ARRAY_CHILDREN;
  }
  return vnode;
}
function getShapeFlags(type) {
  return type === "string" ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT;
}
