import { reactive } from "./reactive";

let activeEffect;

// 依赖收集类
class ReactiveEffect {
  private _fn: any;

  constructor(fn) {
    this._fn = fn;
  }
  run() {
    activeEffect = this;
    this._fn();
  }
}
// 用来存储不同对象的deps
const targetMap = new Map();

// 依赖收集
export function track(target, key) {
  // taget => key => dep
  // dep存储的是每个key对应的依赖 [fn1,fn2,fn3]
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  dep.add(activeEffect);
}
// 触发依赖
export function trigger(target, key) {
  let despMap = targetMap.get(target);
  let dep = despMap.get(key);
  // for of 遍历数组 forin遍历对象
  for (const effect of dep) {
    console.log(effect);
    effect.run();
  }
}
//依赖收集
export function effect(fn) {
  const _effect = new ReactiveEffect(fn);

  _effect.run();
}
