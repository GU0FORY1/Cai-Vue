import { h } from "../../lib/cai-vue.esm.js";
//两个点
// 1、setup接受props参数
// 2、render中通过this.xxx访问到props
// 3、 props不能修改 
export default {
    name:'props',
    render(){
        console.log(this.count)
        return h('div',{},'props:'+this.count)
    },
    //状态
    setup(props){
        props.count = 1
        console.log(props)
    }
}