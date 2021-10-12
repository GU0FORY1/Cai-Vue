import { hasChanged, isObject } from "../shared";
import { isTracking, trackEffect, triggerEffects } from "./effect";
import { reactive } from "./reactive";

//为什么？ref都是单值  1 true “1” 怎么监听改变
// 通过对象 {}ref这个类 value 触发get 触发set
class RefImpl {
  private _value: any;
  public dep;
  public __v_isRef = true;
  private _rawValue: any;
  constructor(value) {
    this._rawValue = value;
    //判断是否为对象否则赋值reactive
    this._value = convert(value);
    this.dep = new Set();
  }
  get value() {
    //不能收集依赖则直接返回
    //优化
    trackRefValue(this);
    return this._value;
  }
  set value(newValue) {
    // 如相等直接返回
    // 为什么不用=== 与===差异 1、NaN等于自身 2、+0不等于-0
    // 如果用=== 新旧值都为NaN时则会触发更新
    // 优化
    //这里用this._value比较有问题 可能是reactive包裹后的 所以要存储一个原始的
    if (hasChanged(this._value, newValue)) return;
    this._rawValue = this.value;
    this._value = convert(newValue);
    triggerEffects(this.dep);
  }
}

export function ref(value) {
  return new RefImpl(value);
}

function trackRefValue(ref) {
  if (isTracking()) {
    trackEffect(ref.dep);
  }
}

//转换 优化
function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

export function isRef(ref) {
  return !!ref.__v_isRef;
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}

export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key) {
      //是ref则返回。value 否则返回本身
      return unRef(Reflect.get(target, key));
    },
    set(target, key, value) {
      //原来为ref 切新值不为 ref 直接修改
      // 其他情况直接替换
      if (isRef(target[key]) && !isRef(value)) {
        return (target[key].value = value);
      } else {
        return Reflect.set(target, key, value);
      }
    },
  });
}
