import { h } from "../../lib/cai-vue.esm.js";
export default {
    render(){
        const a = h('div',{},'下面是插槽')
        return h('div',{},[a,this.$slots])
    },
    setup(){
    }
}