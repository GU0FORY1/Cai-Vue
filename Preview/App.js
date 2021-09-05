
 import { reactive } from "./core/reactivity/reactivity.js";
 import { h } from "./core/h.js";

 // 实际就是组件
export default{
    // 构建视图
    // 返回虚拟dom
   render(context){
           //简单案例返回真实dom
           // let ele = document.createElement('div')
           // ele.innerText = context.state.count
           // return ele

           // 如何表达一个dom？
           //1、tag
           //2、props
           //3、chiildren
           //使用vdom提高性能 > 为diff算法做准备
            return h('div',{class:'test'},[h('div',{},[h('span',{},'666'),h('img',{src:"https://www.baidu.com/img/flexible/logo/pc/result@2.png"},)]),h('div',{},'2'),h('div',{},'3')])
   },
   setup(){
      let state =  reactive({
          count:0
      })
      window.state = state
      return { state }
   }
}

