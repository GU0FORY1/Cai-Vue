import { reactive } from "../reactive";
import { effect, stop } from "../effect";
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

  it("stop的实现", () => {
    /**
     * 执行stop时不去执行effect里的函数
     */
    let obj = reactive({
      count: 0,
    });
    let sum;
    const runner = effect(() => {
      sum = obj.count;
    });
    obj.count = 1;
    expect(sum).toBe(1);

    // 不然里面执行 sum应该没变
    stop(runner);
    obj.count = 2;
    expect(sum).toBe(1);

    runner();
    expect(sum).toBe(2);
  });

  it("onStop的实现", () => {
    /**
     * 执行stop时不去执行effect里的函数
     * 但是执行onStop
     */
    let obj = reactive({
      count: 0,
    });
    let sum;
    const onStop = jest.fn(() => {
      console.log("onsetp执行");
    });
    const runner = effect(
      () => {
        sum = obj.count;
      },
      {
        onStop,
      }
    );
    stop(runner);
    obj.count = 1;
    expect(sum).toBe(0);
    //执行一次onStop方法
    expect(onStop).toHaveBeenCalledTimes(1);
  });
});
