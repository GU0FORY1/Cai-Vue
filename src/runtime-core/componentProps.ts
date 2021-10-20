//初始化话props 把vnode.props挂载到实例
export function initProps(instance, rawProps) {
  instance.props = rawProps || {}; //{}默认值
}
