import { isProxy, isReactive, reactive } from "../reactive";
describe("reactive", () => {
  it("happy path", () => {
    const original = { age: 10 };
    const observed = reactive(original);
    expect(observed).not.toBe(original);
    expect(observed.age).toBe(10);
    expect(isReactive(observed)).toBe(true);
    expect(isReactive(original)).toBe(false);
    expect(isProxy(observed)).toBe(true);
  });

  it("reactive 嵌套对象 ", () => {
    let raw = {
      foo: { a: 1 },
      arr: [{ age: 1 }],
    };
    let obj = reactive(raw);
    expect(isReactive(obj.foo)).toBe(true);
    expect(isReactive(obj.arr)).toBe(true);
  });
});
