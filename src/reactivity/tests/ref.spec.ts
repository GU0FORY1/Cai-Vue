import { effect } from "../effect";
import { ref } from "../ref";

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
});
