import { readonly } from "../reactive";

describe("readonly", () => {
  it("happy path ", () => {
    //set不能执行
    let raw = { count: 1 };
    let obj = readonly(raw);
    obj.count = 2;
    expect(obj).not.toBe(raw);
    expect(obj.count).toBe(1);
  });

  it("set时报错", () => {
    // 方便查看该方法有没有被触发
    console.warn = jest.fn();
    let raw = { count: 1 };
    let obj = readonly(raw);
    obj.count = 2;
    expect(console.warn).toBeCalled();
  });
});
