import { reactive } from "../reactive";
import { effect } from "../effect";
describe("effect", () => {
  it("happy path", () => {
    const user = reactive({
      age: 10,
    });
    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });
    //init
    expect(nextAge).toBe(11);
    //update
    user.age++;
    expect(nextAge).toBe(12);
  });

  it("调用effect时返回runner", () => {
    // 调用effect返回runner runner执行 执行传入的fn 并且返回fn的返回值
    let foo = 10;
    const runner = effect(() => {
      foo++;
    });
    //effect 第一次执行
    expect(foo).toBe(11);
    //返回的runner运行 返回fn的值
    runner();
    expect(foo).toBe(12);
  });

  it("scheduler的实现 ", () => {
    /**
     * effect接受scheduler这个参数
     * 第一次scheduler不执行 执行fn
     * set update时 scheduler执行
     * runner时还是执行fn
     */
    let sum;
    let run;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ count: 1 });
    const runner = effect(
      () => {
        sum = obj.count;
      },
      { scheduler }
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(sum).toBe(1);
    obj.count++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    run();
    expect(sum).toBe(2);
  });
});
