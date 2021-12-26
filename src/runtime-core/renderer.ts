import { effect } from "../reactivity/effect";
import { isObject, ShapeFlags } from "../shared";
import { createComponentInstance, setupComponent } from "./component";
import { createAppApi } from "./createApp";
import { Fragment, Text } from "./vnode";
//为了接受用户传递的自定义函数
export function createRenderer(options) {
  const { createElement, patchProp, insert } = options;

  function render(vnode, container) {
    //初始化n1为null
    patch(null, vnode, container, null);
  }

  function patch(n1, n2, container, parentComponent) {
    // 判断是element还是component 进行区分处理
    const { shapeFlag, type } = n2;

    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent);
        break;
      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent);
        }
        break;
    }
  }

  //处理组件
  function processComponent(n1, n2, container, parentComponent) {
    mountComponent(n2, container, parentComponent);
  }

  //挂载组件
  function mountComponent(initVNode, container, parentComponent) {
    const instance = createComponentInstance(initVNode, parentComponent);
    setupComponent(instance);
    setupRenderEffect(instance, initVNode, container);
  }
  //执行render 进行patch
  function setupRenderEffect(instance, initVNode, container) {
    //触发render里的响应式对象
    effect(() => {
      if (!instance.isMounted) {
        console.log("init");
        //render返回虚拟节点树
        //上一步时已将render挂载到实例上
        const { proxy } = instance;
        //或得proxy对象 更改this指向取到state
        const subTree = instance.render.call(proxy);
        //挂载树 为后面diff准备
        instance.subTree = subTree;

        //渲染子树 所以当前ins就为父节点
        patch(null, subTree, container, instance);
        //mount完毕挂到el
        initVNode.el = subTree.el;

        instance.isMounted = true;
      } else {
        const { proxy } = instance;
        //执行render获取到新树
        const subTree = instance.render.call(proxy);
        const prevSubTree = instance.subTree;
        patch(prevSubTree, subTree, container, instance);
      }
    });
  }
  //处理element
  function processElement(n1, n2, container, parentComponent) {
    if (!n1) {
      mountELement(n2, container, parentComponent);
    } else {
      patchElement(n1, n2, container);
    }
  }

  function patchElement(n1, n2, container) {
    console.log("patchElement");
    console.log("n1", n1);
    console.log("n2", n2);
  }

  //u挂载元素
  function mountELement(vnode, container, parentComponent) {
    //这里的vnode是element类型的 要取到el需要挂载到component类型上去
    //tag
    //createElement 替代
    const el = createElement(vnode.type);
    vnode.el = el;

    //props
    const { props, children } = vnode;
    //遍历props赋值
    for (const key in props) {
      const value = props[key];
      //patchProp替代
      patchProp(el, key, value);
    }

    //children
    // 1、string 2、array
    const { shapeFlag } = vnode;
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.innerHTML = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      //挂载到当前元素里
      mountChildren(vnode, el, parentComponent);
    }

    //添加至容器
    //添加元素 insert
    insert(el, container);
  }
  function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach((v) => {
      //初始化 则null
      patch(null, v, container, parentComponent);
    });
  }

  function processFragment(n1, n2, container, parentComponent) {
    //直接渲染子节点
    mountChildren(n2, container, parentComponent);
  }
  function processText(n1, n2: any, container: any) {
    const { children } = n2;
    const textNode = (n2.el = document.createTextNode(children));
    container.append(textNode);
  }

  return {
    createApp: createAppApi(render),
  };
}
