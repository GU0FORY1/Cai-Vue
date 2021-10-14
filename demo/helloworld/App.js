export const App =  {
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