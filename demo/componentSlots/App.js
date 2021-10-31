import { h,createTextNode } from "../../lib/cai-vue.esm.js";
import Foo from "./Foo.js";
export default {
    render(){
        //单值传入
        // return h('div',{},[h(Foo,{},h('span',{},'我是传入的slots'))])
        //数组传入
        // return h('div',{},[h(Foo,{},
        //     [
        //         h('span',{},'我是传入的slots1'),
        //         h('span',{},'我是传入的slots2')
        //     ])])
        // 具名插槽
        // return h('div',{},[h(Foo,{},
        //     {
        //        header: h('h1',{},'header'),
        //        footer: h('h1',{},'footer')
        //     })])
        // 作用域
        return h('div',{},[h(Foo,{},
            {
               header: ({age})=>[h('h1',{},'header'+age),createTextNode('我是textnode')],
               footer: ()=>h('h1',{},'footer')
            })])
    },
    //状态
    setup(){
        return {
            msg:'03'
        }
    }
}