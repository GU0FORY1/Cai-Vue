// vdom => dom
/**
 * 使用vdom创建真实dom
 * @param {*} vdom 虚拟节点
 * @param {*} elementContainer 元素容器
 */
export function mountElement(vdom, elementContainer) {
  const { tag, props, children } = vdom;
  //tag
  const el = document.createElement(tag);
  // 把el赋值给vdom方便diff去操作 把自己创建的元素赋值给自己
  vdom.el = el;
  // props
  if (props) {
    Object.keys(props).forEach((key) => {
      el.setAttribute(key, props[key]);
    });
  }
  if (children) {
    //children 可能是单个可能是多个
    if (typeof children === "string") {
      const textNode = document.createTextNode(children);
      el.append(textNode);
    } else if (Array.isArray(children)) {
      // 递归的挂载
      children.forEach((v) => {
        mountElement(v, el);
      });
    }
  }
  //render
  elementContainer.append(el);
}

// n1老的 n2新的
/**
 * diff算法
 * @param {*} n1 新vdom
 * @param {*} n2 老vdom
 */
export function diff(n1, n2) {
  // 三种改变
  //tag
  //props
  //children

  //1、处理tag  tag不一样则改变
  if (n1.tag !== n2.tag) {
    n1.el.replaceWith(document.createElement(n2.tag));
  } else {
    // 2、处理props
    //传递 要不保存为prevdom时找不到el
    n2.el = n1.el;
    const { props: newProps } = n2;
    const { props: oldProps } = n1;
    //新的 增加 改变
    if (newProps && oldProps) {
      Object.keys(newProps).forEach((key) => {
        const newVal = newProps[key];
        const oldVal = oldProps[key];
        //值不一样的话则设置
        if (newVal !== oldVal) {
          n1.el.setAttribute(key, newVal);
        }
      });
    }
    //新的 删除
    if (oldProps) {
      Object.keys(oldProps).forEach((key) => {
        const newVal = newProps[key];
        //如果新的里没有则删除
        if (!newVal) {
          n1.el.removeAttribute(key);
        }
      });
    }

    //3、处理children
    const { children: newChilren } = n2;
    const { children: oldChilren } = n1;
    // 四种情况
    // string newchilren=> string oldchilren
    // string newchilren=> array oldchilren
    // array newchilren=> array oldchilren
    // array newchilren=>string oldchilren

    // newChildren string时
    if (typeof newChilren === "string") {
      if (typeof oldChilren === "string") {
        // 不相等时才更新
        if (newChilren !== oldChilren) {
          n1.el.innerText = newChilren;
        }
      } else if (Array.isArray(oldChilren)) {
        n1.el.innerText = newChilren;
      }
    }
    // newChildren array时
    if (Array.isArray(newChilren)) {
      if (typeof oldChilren === "string") {
        // 清空元素然后再创建
        n1.el.innerHTML = "";
        newChilren.forEach((v) => {
          mountElement(v, n1.el);
        });
      } else if (Array.isArray(oldChilren)) {
        const length = Math.min(newChilren.length, oldChilren.length);
        for (let index = 0; index < length; index++) {
          const newDom = newChilren[index];
          const oldDom = oldChilren[index];
          // 将最小长度的部分 进行diff
          diff(newDom, oldDom);
        }
        // 新的比老的多 则创建元素
        if (newChilren.length > length) {
          for (let index = length; index < newChilren.length; index++) {
            const newDom = newChilren[index];
            mountElement(newDom, n1.el);
          }
        }
        // 老的比新的多 则删除元素
        if (oldChilren.length > length) {
          for (let index = length; index < oldChilren.length; index++) {
            const oldDom = oldChilren[index];
            oldDom.el.parentNode.removeChild(oldDom.el);
          }
        }
      }
    }
  }
}
