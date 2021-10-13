import { computed } from "../computed";
import { reactive } from "../reactive";

describe("computed", () => {
  it("happy path", () => {
    const user = reactive({
      age: 1,
    });
    const age = computed(() => {
      return user.age;
    });
    expect(age.value).toBe(1);
  });

  it("缓存", () => {
    const user = reactive({
      age: 1,
    });
    const getter = jest.fn(() => {
      return user.age;
    });
    const age = computed(getter);
    // 没有调用age.value时不调用getter
    expect(getter).not.toHaveBeenCalled();

    expect(age.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);
    // 缓存 只应该调用一次
    expect(age.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);

    //依赖改变事  没有访问value 先不要计算
    user.age = 2;
    expect(getter).toHaveBeenCalledTimes(1);
    // 修改后第一次访问 现在计算
    expect(age.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);

    // 二次访问 不应该计算
    expect(age.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);
  });
});
