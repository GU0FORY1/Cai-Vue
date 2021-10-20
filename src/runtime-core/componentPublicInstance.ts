import { hsaOwn } from "../shared";

const publicPropertiesMap = {
  $el: (instance) => instance.vnode.el,
};

export const PublicInstanceProxyHandlers = {
  get({ instance }, key) {
    //判断setupState中有么
    const { setupState, props } = instance;

    if (hsaOwn(setupState, key)) {
      return setupState[key];
    } else if (hsaOwn(props, key)) {
      return props[key];
    }
    const publicGetter = publicPropertiesMap[key];
    if (publicGetter) {
      return publicGetter(instance);
    }
  },
};
