import { mutablerHsndlers, readonlyHandlers } from "./baseHandlers";

export function reactive(raw) {
  return new Proxy(raw, mutablerHsndlers);
}

export function readonly(raw) {
  return new Proxy(raw, readonlyHandlers);
}
