// vdom => dom
export function mountElement(vdom,rootEle) {

    const { tag, props, children }  = vdom
    //tag
    let el  = document.createElement(tag)

    // props
    if (props) {
        Object.keys(props).forEach(key=>{
            el.setAttribute(key,props[key])
        })
    }

    if (children) {
        //children 可能是单个可能是多个
        if (typeof children === 'string') {
            const textNode = document.createTextNode(children)
            el.append(textNode)
        }else if (Array.isArray(children)) {
            // 递归的挂载
            children.forEach(v=>{
                mountElement(v,el)
            })
        }
    }

    //render
    rootEle.append(el)
}