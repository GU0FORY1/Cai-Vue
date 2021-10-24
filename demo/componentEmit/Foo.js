import { h } from "../../lib/cai-vue.esm.js";
export default {
    render(){
        return h('button',{onClick:this.emitEvent},'event')
    },
    //状态
    setup(props,{emit}){
        const emitEvent=()=>{
            emit('add','传入参数')
        }
        return {
            msg:'03',
            emitEvent
        }
    }
}