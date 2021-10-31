import { h,getCurrentInstance } from "../../lib/cai-vue.esm.js";
import Foo from "./Foo.js";
export default {
    name:'app',
    render(){
        return h('div',{},[h('div',{},'APP'),h(Foo)])
    },
    setup(){
      console.log("app:",getCurrentInstance())
    }
}