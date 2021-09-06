// 用于返回vdom
export function h(tag, props, children) {
  return {
    tag,
    props,
    children,
  };
}
