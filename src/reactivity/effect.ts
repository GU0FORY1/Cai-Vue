let activeEffect;

// 依赖收集类
class ReactiveEffect {
  private _fn: any;
  deps = [];
  onStop: any;
  constructor(fn, public scheduler?) {
    this._fn = fn;
  }
  run() {
    activeEffect = this;
    //runner运行后 要的返回值
    return this._fn();
  }
  stop() {
    if (this.onStop) {
      this.onStop();
    }
    this.deps.forEach((dep: any) => {
      dep.delete(this);
    });
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
  //利用activeEffect把deps收集起来
  activeEffect.deps.push(dep);
}
// 触发依赖
export function trigger(target, key) {
  let despMap = targetMap.get(target);
  let dep = despMap.get(key);
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
export function effect(fn, options: any = {}) {
  const { scheduler, onStop } = options;
  const _effect = new ReactiveEffect(fn, scheduler);
  // _effect.onStop = onStop;
  //把options全部挂载到_effect上
  Object.assign(_effect, options);
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
