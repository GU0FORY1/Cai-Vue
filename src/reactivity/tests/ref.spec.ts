import { effect } from "../effect";
import { reactive } from "../reactive";
import { isRef, ref, unRef } from "../ref";

describe("ref", () => {
  it("happy path", () => {
    let a = ref(1);
    expect(a.value).toBe(1);
  });
  it("ref effect", () => {
    let a = ref(1);
    let b = 0;
    let c = 0;
    effect(() => {
      c++;
      //get时收集依赖
      b = a.value;
    });
    expect(c).toBe(1);
    expect(b).toBe(1);
    //set时去触发依赖
    a.value = 2;
    expect(c).toBe(2);
    expect(b).toBe(2);
    //值未改变时不执行effect
    a.value = 2;
    expect(c).toBe(2);
    expect(b).toBe(2);
  });

  it("ref传入object时的处理", () => {
    const a = ref({
      age: 1,
    });
    let tmp;
    effect(() => {
      tmp = a.value.age;
    });
    expect(tmp).toBe(1);
    a.value.age = 12;
    expect(tmp).toBe(12);
  });

  it("isRef", () => {
    const a = ref(1);
    const obj = reactive({ a: 1 });
    expect(isRef(a)).toBe(true);
    expect(isRef(1)).toBe(false);
    expect(isRef(obj)).toBe(false);
  });

  // 返回ref.value
  it("unRef", () => {
    const a = ref(1);
    const obj = reactive({ a: 1 });
    expect(unRef(a)).toBe(1);
    expect(unRef(1)).toBe(1);
  });
});
