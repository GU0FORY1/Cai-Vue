export { ShapeFlags } from "./ShapeFlags";

export const extend = Object.assign;

export const isObject = (val) => {
  return val !== null && typeof val === "object";
};

export const hasChanged = (value, newValue) => {
  return !Object.is(value, newValue);
};

export const hsaOwn = (target, key) => Reflect.has(target, key);

export const capitalize = (str: string) => {
  //首字母大写
  return str ? str.charAt(0).toLocaleUpperCase() + str.slice(1) : "";
};
