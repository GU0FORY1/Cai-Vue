import { h,renderSlots } from "../../lib/cai-vue.esm.js";
export default {
    render(){
        const a = h('div',{},'中心')
        // //使用renderSlots 进行slots渲染 
        // return h('div',{},[
        //     a,
        //     renderSlots(this.$slots)
        // ])
        const age = 11
        //指定插槽位置渲染
        return h('div',{},[
            renderSlots(this.$slots,'header',{
                age
            }),
            a,
            renderSlots(this.$slots,'footer')
        ])
    },
    setup(){
    }
}