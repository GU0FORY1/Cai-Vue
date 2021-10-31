import { isObject, ShapeFlags } from "../shared";
import { createComponentInstance, setupComponent } from "./component";
import { Fragment } from "./vnode";

export function render(vnode, container) {
  patch(vnode, container);
}
function patch(vnode, container) {
  // 判断是element还是component 进行区分处理
  const { shapeFlag, type } = vnode;

  switch (type) {
    case Fragment:
      processFragment(vnode, container);
      break;
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container);
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container);
      }
      break;
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
  //children
  // 1、string 2、array
  const { shapeFlag } = vnode;
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.innerHTML = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
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

function processFragment(vnode: any, container: any) {
  //直接渲染子节点
  mountChildren(vnode, container);
}
