import { extend } from "../shared";
let activeEffect;
let shouldTrack;

// 依赖收集类
class ReactiveEffect {
  private _fn: any;
  deps = [];
  onStop?: () => void;
  isActive = true;
  constructor(fn, public scheduler?) {
    this._fn = fn;
  }
  run() {
    //runner运行后 要的返回值
    // stop 下的状态 不用收集依赖
    if (!this.isActive) {
      return this._fn();
    }
    // 保存当前执行的fn
    activeEffect = this;
    // 设置需要收集标识
    shouldTrack = true;
    // 执行fn的时候 就会访问响应式数据中的get 从而触发依赖收集
    const result = this._fn();
    // 重置需要收集标识  以防收集到不需要收集的依赖
    shouldTrack = false;
    return result;
  }
  stop() {
    // 防止stop多次执行
    if (this.isActive) {
      if (this.onStop) {
        this.onStop();
      }
      cleanEffect(this);
      this.isActive = false;
    }
  }
}
function cleanEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
  // 优化点
  effect.deps.length = 0;
}

// 用来存储不同对象的deps
const targetMap = new Map();

// 依赖收集
export function track(target, key) {
  // 判断是否收集依赖
  if (!isTracking()) return;

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

  trackEffect(dep);
}
//收集依赖
export function trackEffect(dep) {
  // 处理重复依赖
  if (dep.has(activeEffect)) return;
  dep.add(activeEffect);
  // 反向收集  把当前的所有依赖 放入effect当中 比如在使用停止函数的时候进行使用
  activeEffect.deps.push(dep);
}
//判断当前能否收集依赖
export function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}
// 触发依赖
export function trigger(target, key) {
  let despMap = targetMap.get(target);
  let dep = despMap.get(key);

  triggerEffects(dep);
}
// 执行依赖
export function triggerEffects(dep) {
  // for of 遍历数组 forin遍历对象
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}
//依赖收集
//effct才会把_effect挂载到activeEffect
export function effect(fn, options: any = {}) {
  const { scheduler, onStop } = options;
  const _effect = new ReactiveEffect(fn, scheduler);
  // _effect.onStop = onStop;
  //把options全部挂载到_effect上
  extend(_effect, options); //语义化重构
  // 第一次执行先运行fn
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  // 把_effct挂载上方便stop事执行_effect中的stop方法
  runner.effect = _effect;
  // _effect bind里面的this
  return runner;
}

export function stop(runner) {
  // 执行RE类中的stop方法
  runner.effect.stop();
}
