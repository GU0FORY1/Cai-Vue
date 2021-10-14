import { h } from "../../lib/cai-vue.esm.js";
export default {
    //渲染视图
    render(){
        return h('div',{},'hello')
    },
    //状态
    setup(){
        return {
            msg:'hello'
        }
    }
}