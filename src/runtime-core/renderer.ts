import { isObject } from "../shared";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  patch(vnode, container);
}
function patch(vnode, container) {
  // 判断是element还是component 进行区分处理
  if (typeof vnode.type === "string") {
    processElement(vnode, container);
  } else if (isObject(vnode.type)) {
    processComponent(vnode, container);
  }
}

//处理组件
function processComponent(vnode, container) {
  mountComponent(vnode, container);
}

//挂载组件
function mountComponent(initVNode, container) {
  const instance = createComponentInstance(initVNode);
  setupComponent(instance);
  setupRenderEffect(instance, initVNode, container);
}
//执行render 进行patch
function setupRenderEffect(instance, initVNode, container) {
  //render返回虚拟节点树
  //上一步时已将render挂载到实例上
  const { proxy } = instance;
  //或得proxy对象 更改this指向取到state
  const subTree = instance.render.call(proxy);

  patch(subTree, container);
  //mount完毕挂到el
  initVNode.el = subTree.el;
}
//处理element
function processElement(vnode, container) {
  mountELement(vnode, container);
}

//u挂载元素
function mountELement(vnode, container) {
  //这里的vnode是element类型的 要取到el需要挂载到component类型上去
  //tag
  const el = document.createElement(vnode.type);
  vnode.el = el;
  //props
  const { props, children } = vnode;
  //遍历props赋值
  for (const key in props) {
    const value = props[key];
    el.setAttribute(key, value);
  }
  //children
  // 1、string 2、array
  if (typeof children === "string") {
    el.innerHTML = children;
  } else if (Array.isArray(children)) {
    //挂载到当前元素里
    mountChildren(vnode, el);
  }
  //添加至容器
  container.append(el);
}
function mountChildren(vnode, container) {
  vnode.children.forEach((item) => {
    patch(item, container);
  });
}
