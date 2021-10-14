import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  patch(vnode, container);
}
function patch(vnode, container) {
  processComponent(vnode, container);
}

//处理组件
function processComponent(vnode, container) {
  mountComponent(vnode, container);
}

//挂载组件
function mountComponent(vnode, container) {
  const instance = createComponentInstance(vnode);
  setupComponent(instance);
}
//执行render 进行patch
function setupRenderEffect(instance, container) {
  //render返回虚拟节点树
  //上一步时已将render挂载到实例上
  const subTree = instance.render();

  patch(subTree, container);
}
//处理元素
function processElement() {}
