import { ShapeFlags } from "../shared";

export function initSlots(instance, children) {
  //把单个的转为都转为数组进行处理  下面都进行了
  // instance.slots = Array.isArray(children) ? children : [children];
  const { vnode } = instance;
  //是slot的才执行
  if (vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
    //转换slots为对象 使用统一的数据结构
    normalizeObjectSlots(children, instance.slots);
  }
}
// 规范化对象插槽
function normalizeObjectSlots(children, slots) {
  //for in 数组 对象都可遍历
  for (const key in children) {
    const value = children[key];
    //如果指定名称插槽存在 则判断他们是否符合条件
    if (value) {
      // 这里有点绕
      slots[key] = (props) => normalizeSlotValue(value(props));
    }
  }
}
// 规范化插槽返回值
function normalizeSlotValue(value) {
  return Array.isArray(value) ? value : [value];
}
