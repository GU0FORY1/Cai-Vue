//custom renderer的实现
//custrender核心就是把原来创建元素、设置元素属性、添加元素的方法抽离出来
import { createRenderer } from "../runtime-core";

function createElement(vnode) {
  return document.createElement(vnode.type);
}
function patchProp(el, key, value) {
  //是否符合onXxx
  const isOn = (key) => /^on[A-Z]/.test(key);
  //处理注册事件
  if (isOn(key)) {
    const event = key.slice(2).toLocaleLowerCase();
    el.addEventListener(event, value);
  } else {
    el.setAttribute(key, value);
  }
}
function insert(el, container) {
  container.append(el);
}

//把处理方法注入 返回{crateApp}
const renderer: any = createRenderer({
  createElement,
  patchProp,
  insert,
});

//包装一层方便用户调用
export function createApp(...args) {
  //实际调用createAppApi方法返回的方法 用于创建初始化
  return renderer.createApp(...args);
}

export * from "../runtime-core";
