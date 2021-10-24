import { h } from "../../lib/cai-vue.esm.js";
import Foo from "./Foo.js";
export default {
    render(){
        return h('div',{},[h(Foo,{
            onAdd(a){
                console.log('触发了onAdd',a)
            }
        })])
    },
    //状态
    setup(){
        return {
            msg:'03'
        }
    }
}