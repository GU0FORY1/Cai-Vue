import { track, trigger } from "./effect";

// get函数创造器
function createGetter(isReadonly = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key);
    if (!isReadonly) {
      //依赖收集
      track(target, key);
    }
    return res;
  };
}
// set函数创造器
function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value);
    //执行依赖
    trigger(target, key);
    return res;
  };
}
// 优化性能 没有必要没次都 return一个函数
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);

// reactive的
export const mutablerHsndlers = {
  get,
  set,
};
// readonly的
export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`readonly不能被set`);
    return true;
  },
};
