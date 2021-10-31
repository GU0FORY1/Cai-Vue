import { h,getCurrentInstance } from "../../lib/cai-vue.esm.js";
export default {
    name:'foo',
    render(){
        return h('div',{},'FOO')
    },
    setup(){
      console.log("FOO:",getCurrentInstance())
    }
}