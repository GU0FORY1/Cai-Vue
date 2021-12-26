import { shallowReadonly } from "../reactivity/reactive";
import { proxyRefs } from "../reactivity/ref";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { initSlots } from "./componentSlots";
let currentInstance = null;
//初始化一个组件实例
export function createComponentInstance(vnode, parent) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    //初始化provides
    provides: parent ? parent.provides : {},
    parent,
    slots: {},
    isMounted: false,
    subTree: {},
    emit: () => {},
  };
  //方便用户使用不用传入instance
  component.emit = emit.bind(null, component) as any;

  return component;
}

export function setupComponent(instance) {
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);
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
    //getCurrentInsance 必须在setup里才能用
    setCurrentInstance(instance);
    //props给到setup
    // props不可修改 shallowReadonly
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    });
    setCurrentInstance(null);
    //把执行结果挂载到实例
    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance, setupResult) {
  // function Object
  // TODO function
  if (typeof setupResult === "object") {
    //自动转化.value
    instance.setupState = proxyRefs(setupResult);
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

export function getCurrentInstance() {
  return currentInstance;
}

function setCurrentInstance(instance) {
  currentInstance = instance;
}
