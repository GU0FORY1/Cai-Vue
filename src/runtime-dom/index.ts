//custom renderer的实现
//custrender核心就是把原来创建元素、设置元素属性、添加元素的方法抽离出来
import { createRenderer } from "../runtime-core";

function createElement(type) {
  return document.createElement(type);
}
function patchProp(el, key, oldValue, nextValue) {
  //是否符合onXxx
  const isOn = (key) => /^on[A-Z]/.test(key);
  //处理注册事件
  if (isOn(key)) {
    const event = key.slice(2).toLocaleLowerCase();
    el.addEventListener(event, nextValue);
  } else {
    if (nextValue === undefined || nextValue === null) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, nextValue);
    }
  }
}
function insert(el, container) {
  container.append(el);
}

function remove(child) {
  //把父级里的子节点都删除
  const parent = child.parentNode;
  if (parent) {
    parent.removeChild(child);
  }
}

function setElementText(container, text) {
  container.textContent = text;
}

//把处理方法注入 返回{crateApp}
const renderer: any = createRenderer({
  createElement,
  patchProp,
  insert,
  remove,
  setElementText,
});

//包装一层方便用户调用
export function createApp(...args) {
  //实际调用createAppApi方法返回的方法 用于创建初始化
  return renderer.createApp(...args);
}

export * from "../runtime-core";
