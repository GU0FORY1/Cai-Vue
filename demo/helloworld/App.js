import { h } from "../../lib/cai-vue.esm.js";
export default {
    //渲染视图
    render(){
        // return h('div',{},'hello'+this.msg)
        window.self = this
        // return h('div',{},'console root')
        return h('div',{},[h('div',{},'hello'),h('div',{},'wolrd')])
    },
    //状态
    setup(){
        return {
            msg:'03'
        }
    }
}