var isObject = function (val) {
    return val !== null && typeof val === "object";
};

//初始化一个组件实例
function createComponentInstance(vnode) {
    var component = {
        vnode: vnode,
        type: vnode.type,
    };
    return component;
}
function setupComponent(instance) {
    setupStatefulComponent(instance);
}
//创建一个有状态的组件
function setupStatefulComponent(instance) {
    var Component = instance.type;
    var setup = Component.setup;
    if (setup) {
        var setupResult = setup();
        //把执行结果挂载到实例
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // function Object
    // TODO function
    if (typeof setupResult === "object") {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
//把render挂载到实例
function finishComponentSetup(instance) {
    var Component = instance.type;
    if (Component.render) {
        instance.render = Component.render;
    }
}

function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    // 判断是element还是component 进行区分处理
    if (typeof vnode.type === "string") {
        processElement(vnode, container);
    }
    else if (isObject(vnode.type)) {
        processComponent(vnode, container);
    }
}
//处理组件
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
//挂载组件
function mountComponent(vnode, container) {
    var instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, container);
}
//执行render 进行patch
function setupRenderEffect(instance, container) {
    //render返回虚拟节点树
    //上一步时已将render挂载到实例上
    var subTree = instance.render();
    patch(subTree, container);
}
//处理element
function processElement(vnode, container) {
    mountELement(vnode, container);
}
//u挂载元素
function mountELement(vnode, container) {
    //tag
    var el = document.createElement(vnode.type);
    //props
    var props = vnode.props, children = vnode.children;
    //遍历props赋值
    for (var key in props) {
        var value = props[key];
        el.setAttribute(key, value);
    }
    //children
    // 1、string 2、array
    if (typeof children === "string") {
        el.innerHTML = children;
    }
    else if (Array.isArray(children)) {
        //挂载到当前元素里
        mountChildren(vnode, el);
    }
    //添加至容器
    container.append(el);
}
function mountChildren(vnode, container) {
    vnode.children.forEach(function (item) {
        patch(item, container);
    });
}

function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children,
    };
    return vnode;
}

function createApp(rootComponent) {
    return {
        mount: function (rootContainer) {
            // 先转换成vnode
            var vnode = createVNode(rootComponent);
            //然后渲染
            render(vnode, rootContainer);
        },
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h };
