import { h } from "../../lib/cai-vue.esm.js";
import Foo from "./Foo.js";
export default {
    render(){
        return h('div',{},[h(Foo,{},h('span',{},'我是传入的slots'))])
    },
    //状态
    setup(){
        return {
            msg:'03'
        }
    }
}