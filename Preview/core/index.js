import { effectWatch } from "./reactivity/reactivity.js";
import { mountElement, diff } from "./renderer/index.js";
// component.render(component.setup())
// createApp(component).mount(Element)

export function createApp(component) {
  return {
    // 将dom挂载到页面上
    mount(id, css) {
      // 相当于声明
      let context = component.setup();
      let isMonted = false;
      let prevDom;
      // 挂载样式
      const head = document.getElementsByTagName("head")[0];
      const style = document.createElement("style");
      style.innerHTML = css;
      head.appendChild(style);

      effectWatch(() => {
        let el = document.getElementById(id);
        const vdom = component.render(context);

        //可以增加吧css挂载进去
        if (!isMonted) {
          //init
          el.innerHTML = "";
          //把虚拟dom挂载
          mountElement(vdom, el);
          isMonted = true;
        } else {
          //update
          // 比较差异修改
          diff(prevDom, vdom);
        }
        //为下次比较做准备
        prevDom = vdom;
      });
    },
  };
}
