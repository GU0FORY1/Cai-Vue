import { getCurrentInstance } from "./component";

export function provide(key, value) {
  const currentInstance: any = getCurrentInstance();
  //可以存在组件的实例上

  if (currentInstance) {
    let { provides } = currentInstance;
    const parentProvides = currentInstance.parent?.provides;
    //为每个组件都建立自己的provides 使用原型链的方式向上查找 指定__proto__为父级provides

    if (provides === parentProvides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    //在当前组件的provides上添加数据

    provides[key] = value;
  }
}

export function inject(key, defaultValue) {
  const currentInstance: any = getCurrentInstance();

  if (currentInstance) {
    const parentProvides = currentInstance.parent.provides;

    if (key in parentProvides) {
      return parentProvides[key];
    } else if (defaultValue) {
      //处理默认值时
      if (typeof defaultValue === "function") {
        return defaultValue();
      }
      return defaultValue;
    }
  }
}
