import { isTracking, trackEffect, triggerEffects } from "./effect";

class RefImpl {
  private _value: any;
  public dep;
  constructor(value) {
    this._value = value;
    this.dep = new Set();
  }
  get value() {
    //不能收集依赖则直接返回
    if (isTracking()) {
      trackEffect(this.dep);
    }
    return this._value;
  }
  set value(newValue) {
    // 如相等直接返回
    // 为什么不用=== 与===差异 1、NaN等于自身 2、+0不等于-0
    // 如果用=== 新旧值都为NaN时则会触发更新
    if (Object.is(this._value, newValue)) return;
    this._value = newValue;
    triggerEffects(this.dep);
  }
}

export function ref(value) {
  return new RefImpl(value);
}
