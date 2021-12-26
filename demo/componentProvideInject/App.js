import { h, provide, inject } from "../../lib/cai-vue.esm.js";
export default {
  name: "app",
  render() {
    return h("div", {}, [h("div", {}, "APP"), h(Foo)]);
  },
  setup() {
    provide("name", "tom");
    provide("age", 12);
    provide("val", "appVal");
  },
};

const Foo = {
  name: "Foo",
  render() {
    return h("div", {}, [
      h("span", {}, [
        h("span", {}, `fooval val ${this.val} ;${this.name}-${this.age}`),
        h(son),
      ]),
    ]);
  },
  setup() {
    provide("val", "fooVal");
    const age = inject("age");
    const name = inject("name");
    //这里我想取的是appval 不判断则会被替换掉
    const val = inject("val");
    return {
      name,
      age,
      val,
    };
  },
};
const son = {
  name: "son",
  render() {
    return h("div", {}, [h("div", {}, `son val${this.val}`)]);
  },
  setup() {
    const val = inject("val");
    return {
      val,
    };
  },
};
