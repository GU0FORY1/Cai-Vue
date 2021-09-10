import { reactive } from "../reactive";
describe("reactive", () => {
  it("happy path", () => {
    const original = { age: 10 };
    const observed = reactive(original);
    expect(observed).not.toBe(original);
    expect(observed.age).toBe(10);
  });
});
