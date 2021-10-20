export { ShapeFlags } from "./ShapeFlags";

export const extend = Object.assign;

export const isObject = (val) => {
  return val !== null && typeof val === "object";
};

export const hasChanged = (value, newValue) => {
  return !Object.is(value, newValue);
};

export const hsaOwn = (target, key) => Reflect.has(target, key);
