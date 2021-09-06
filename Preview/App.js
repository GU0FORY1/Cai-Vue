import { reactive } from "./core/reactivity/reactivity.js";
import { h } from "./core/h.js";

// 实际就是组件
export default {
  // 构建视图
  // 返回虚拟dom
  render(context) {
    //简单案例返回真实dom
    // let ele = document.createElement('div')
    // ele.innerText = context.state.count
    // return ele
    // 如何表达一个dom？
    //1、tag
    //2、props
    //3、chiildren
    //使用vdom提高性能 > 为diff算法做准备

    // string=>array
    // return h(
    //   "div",
    //   { class: "test" },
    //   context.state.count > 0 ? [h("div", {}, "现在是1")] : "现在是0"
    // );

    // string => strings
    // return h(
    //   "div",
    //   { class: "test" },
    //   context.state.count > 0 ? "现在是1" : "现在是0"
    // );

    // (array) => strings;
    // return h(
    //   "div",
    //   { class: "test" },
    //   context.state.count > 0 ? "string" : [h("div", {}, "array")]
    // );

    // oldarray > newarray;
    // return h(
    //   "div",
    //   { class: "test" },
    //   context.state.count > 0
    //     ? [h("div", {}, "1")]
    //     : [h("div", {}, "1"), h("div", {}, "2")]
    // );

    // newarray > oldarray;
    return h(
      "div",
      { class: "test" },
      context.state.count > 0
        ? [h("div", {}, "1"), h("div", {}, "2")]
        : [h("div", {}, "1")]
    );
  },
  setup() {
    let state = reactive({
      count: 0,
    });
    window.state = state;
    return { state };
  },
};
