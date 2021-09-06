/**
 * 核心点
 * 1、使用cureffect连接类与函数，使得能进行依赖收集
 * 2、巧用get set，get时收集依赖，set时执行依赖
 * 3、依赖就是effect中的方法
 */

let cureffect;

class Ref {
  constructor(val) {
    this.val = val;
    this.effects = new Set();
  }
  get value() {
    //用到的时候才收集依赖
    this.depend();
    return this.val;
  }
  set value(val) {
    this.val = val;
    this.notice();
  }
  // 收集依赖
  depend() {
    if (cureffect) {
      this.effects.add(cureffect);
    }
  }
  // 触发依赖
  notice() {
    this.effects.forEach((effect) => {
      effect();
    });
  }
}

// effectWatch的实现
export function effectWatch(effect) {
  cureffect = effect;
  //a.depend()
  //一上来会调用一次
  effect();
  cureffect = null;
}

//类似ref的实现
// let a = new Ref(1);
// let b = 0;

// effectWatch(() => {
//   console.log("effct执行了");
//   b = a.value + 20;
// });

// a.value = 80;
// console.log(a.value,b)

let targetMap = new Map();
//传入对象
//每个对象对应 targetmap中的一个 refs
//每个对象的key 对应refs中的 ref

// obj(传入的对象) refs（obj对应的ref集合） ref（obj[key] 对应的ref）
// targetMao.get(obj)=>refs   refs.get(key)=>ref

function getRef(target, key) {
  let refs = targetMap.get(target);
  if (!refs) {
    //第一次进来不存在就new
    refs = new Map();
    targetMap.set(target, refs);
  }
  let ref = refs.get(key);
  if (!ref) {
    //第一次进来
    ref = new Ref();
    refs.set(key, ref);
  }
  return ref;
}
export function reactive(raw) {
  //对每个key进行响应式处理，使用proxy，可以批量对key进行get/set操作
  return new Proxy(raw, {
    //target 目标对象 key访问键值
    // 只是对依赖进行收集
    get(target, key) {
      const ref = getRef(target, key);
      // 收集依赖
      ref.depend();
      return Reflect.get(target, key);
    },

    // 我的理解是这里仅仅使用了ref收集依赖的功能进行执行，而不是对ref进行赋值操作
    // 先对原始对象进赋值  然后使用对应的ref进行依赖的执行
    set(target, key, value) {
      const ref = getRef(target, key);
      const res = Reflect.set(target, key, value);
      // 依赖执行
      ref.notice();
      return res;
    },
  });
}

// let c = reactive({
//   name:'666'
// })

// effectWatch(()=>{
//   console.log('执行更新')
// })
// c.name = '999'
// console.log(c)
