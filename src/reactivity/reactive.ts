import {
  mutablerHsndlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from "./baseHandlers";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
}

export function reactive(raw) {
  return new Proxy(raw, mutablerHsndlers);
}

export function readonly(raw) {
  return new Proxy(raw, readonlyHandlers);
}

export function shallowReadonly(raw) {
  return new Proxy(raw, shallowReadonlyHandlers);
}

export function isReactive(value) {
  // return !!value[ReactiveFlags.IS_REACTIVE]; 这种写法实际是 Boolean(xxx) 返回的布尔类型
  return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}
