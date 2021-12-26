import { isObject, ShapeFlags } from "../shared";
import { createComponentInstance, setupComponent } from "./component";
import { Fragment, Text } from "./vnode";

export function render(vnode, container) {
  patch(vnode, container, null);
}
function patch(vnode, container, parentComponent) {
  // 判断是element还是component 进行区分处理
  const { shapeFlag, type } = vnode;

  switch (type) {
    case Fragment:
      processFragment(vnode, container, parentComponent);
      break;
    case Text:
      processText(vnode, container);
      break;
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container, parentComponent);
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container, parentComponent);
      }
      break;
  }
}

//处理组件
function processComponent(vnode, container, parentComponent) {
  mountComponent(vnode, container, parentComponent);
}

//挂载组件
function mountComponent(initVNode, container, parentComponent) {
  const instance = createComponentInstance(initVNode, parentComponent);
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
  //渲染子树 所以当前ins就为父节点
  patch(subTree, container, instance);
  //mount完毕挂到el
  initVNode.el = subTree.el;
}
//处理element
function processElement(vnode, container, parentComponent) {
  mountELement(vnode, container, parentComponent);
}

//u挂载元素
function mountELement(vnode, container, parentComponent) {
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
    mountChildren(vnode, el, parentComponent);
  }
  //添加至容器
  container.append(el);
}
function mountChildren(vnode, container, parentComponent) {
  vnode.children.forEach((item) => {
    patch(item, container, parentComponent);
  });
}

function processFragment(vnode: any, container: any, parentComponent) {
  //直接渲染子节点
  mountChildren(vnode, container, parentComponent);
}
function processText(vnode: any, container: any) {
  const { children } = vnode;
  const textNode = (vnode.el = document.createTextNode(children));
  container.append(textNode);
}
