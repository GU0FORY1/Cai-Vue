import { isReadonly, shallowReadonly } from "../reactive";

// 表层readonly的实现 只是最外面一层为reaconly 里面对象为普通
describe("shallowReadonly", () => {
  it("shallowReadonly 实现 ", () => {
    let raw = {
      a: 1,
      b: { age: 20 },
    };
    let obj = shallowReadonly(raw);
    expect(isReadonly(obj)).toBe(true);
    expect(isReadonly(obj.b)).toBe(false);
  });
  it("set时报错", () => {
    // 方便查看该方法有没有被触发
    console.warn = jest.fn();
    let raw = { count: 1 };
    let obj = shallowReadonly(raw);
    obj.count = 2;
    expect(console.warn).toBeCalled();
  });
});
