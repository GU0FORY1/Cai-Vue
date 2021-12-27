import { effect } from "../reactivity/effect";
import { isObject, ShapeFlags } from "../shared";
import { createComponentInstance, setupComponent } from "./component";
import { createAppApi } from "./createApp";
import { Fragment, Text } from "./vnode";
//为了接受用户传递的自定义函数
export function createRenderer(options) {
  //传入的操作方法
  const { createElement, patchProp, insert, remove, setElementText } = options;

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
      patchElement(n1, n2, container, parentComponent);
    }
  }

  function patchElement(n1, n2, container, parentComponent) {
    console.log("patchElement");
    console.log("n1", n1);
    console.log("n2", n2);

    const oldProps = n1.props || {};
    const nextProps = n2.props || {};
    const el = (n2.el = n1.el);
    patchChildren(n1, n2, el, parentComponent);
    patchProps(el, oldProps, nextProps);
  }

  //处理子节点
  function patchChildren(n1, n2, container, parentComponent) {
    const prevShapeFlag = n1.shapeFlag;
    const shapeFlag = n2.shapeFlag;
    const c1 = n1.children;
    const c2 = n2.children;

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      //new text
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        //old array
        //把原来的清空
        unmountChildren(c1);
      }
      //old array 和 newtext 不相等触发 oldtext和newtext不相等
      if (c1 !== c2) {
        setElementText(container, c2);
      }
    } else {
      //new array
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        //old array diff算法进行实现
      } else {
        //old text
        setElementText(container, "");
        mountChildren(c2, container, parentComponent);
      }
    }
  }
  function unmountChildren(childrens) {
    for (let i = 0; i < childrens.length; i++) {
      const children = childrens[i];
      const { el } = children;
      remove(el);
    }
  }
  //处理props
  function patchProps(el, oldProps, nextProps) {
    /**
     * 1、值改变
     * 2、值无效 undefined null
     * 3、值删除
     */
    //遍历新的看看值是否改变
    if (oldProps !== nextProps) {
      for (const key in nextProps) {
        const oldProp = oldProps[key];
        const nextProp = nextProps[key];
        if (oldProp !== nextProps) {
          //处理
          patchProp(el, key, oldProp, nextProp);
        }
      }
      //判断新的不是空对象
      if (Object.keys(nextProps)) {
        //遍历老的看看是否删除
        for (const key in oldProps) {
          //删除的话则remove
          if (!(key in nextProps)) {
            patchProp(el, key, oldProps[key], null);
          }
        }
      }
    }
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
      patchProp(el, key, null, value);
    }

    //children
    // 1、string 2、array
    const { shapeFlag } = vnode;
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.innerHTML = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      //挂载到当前元素里
      mountChildren(children, el, parentComponent);
    }

    //添加至容器
    //添加元素 insert
    insert(el, container);
  }
  function mountChildren(children, container, parentComponent) {
    children.forEach((v) => {
      //初始化 则null
      patch(null, v, container, parentComponent);
    });
  }

  function processFragment(n1, n2, container, parentComponent) {
    //直接渲染子节点
    mountChildren(n2.children, container, parentComponent);
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
