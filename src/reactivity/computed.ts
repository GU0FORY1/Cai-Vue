import { ReactiveEffect } from "./effect";

class ComputedRefImpl {
  private _getter: any;
  private _dirty: Boolean = true;
  private _value: any;
  private _effect: ReactiveEffect;
  constructor(getter) {
    this._getter = getter;
    //*有点忘了 巧妙运用ReactiveEffect
    //set 时scheduler会调用
    this._effect = new ReactiveEffect(getter, () => {
      //触发set了 为下一次计算属性做准备
      if (!this._dirty) {
        this._dirty = true;
      }
    });
  }
  get value() {
    // 判断是否是需要执行getter
    if (this._dirty) {
      this._dirty = false;
      //缓存一下执行结果
      this._value = this._effect.run();
    }
    return this._value;
  }
}
export function computed(getter) {
  return new ComputedRefImpl(getter);
}
