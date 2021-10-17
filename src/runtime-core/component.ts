import { PublicInstanceProxyHandlers } from "./componentPublicInstance";

//初始化一个组件实例
export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
  };
  return component;
}

export function setupComponent(instance) {
  setupStatefulComponent(instance);
}
//创建一个有状态的组件
export function setupStatefulComponent(instance) {
  const Component = instance.type;

  //实现组件代理 this.$el...
  //代理从setupState中取值
  //优化重构
  instance.proxy = new Proxy({ instance }, PublicInstanceProxyHandlers);

  const { setup } = Component;

  if (setup) {
    const setupResult = setup();
    //把执行结果挂载到实例
    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance, setupResult) {
  // function Object
  // TODO function
  if (typeof setupResult === "object") {
    instance.setupState = setupResult;
  }
  finishComponentSetup(instance);
}

//把render挂载到实例
function finishComponentSetup(instance: any) {
  const Component = instance.type;
  if (Component.render) {
    instance.render = Component.render;
  }
}
