import { effectWatch } from "./reactivity/reactivity.js";
import { mountElement } from "./renderer/index.js";
// component.render(component.setup())
// createApp(component).mount(Element)

export function createApp(component) {
    return{
        // 将dom挂载到页面上
        mount(id){
            // 相当于声明
            let context = component.setup()
            effectWatch((()=>{
                let el = document.getElementById(id)
        
                const vdom = component.render(context)
                //把虚拟dom挂载
                mountElement(vdom,el)
            }))
        }
    }
}
