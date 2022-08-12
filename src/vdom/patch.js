import { isSameVnode } from "./index";

/**
 * 将虚拟节点转为真实节点后插入到元素中
 * @param {*} el    当前真实元素 id#app
 * @param {*} vnode 虚拟节点
 * @returns         新的真实元素
 */
export function patch(oldVnode, vnode) {
  const isRealElement = oldVnode.nodeType;
  if (isRealElement) {
    // 1.根据虚拟节点创建真实节点
    const elm = createElm(vnode);
    console.log("生成的真实dom节点：", elm);
    // 2.使用真实节点替换原来的老节点
    const parentNode = oldVnode.parentNode;
    // 找到老节点的下一个兄弟节点，（nextSiBling 若不存在将返回null)
    const nextSibling = oldVnode.nextSibling;
    // 将新节点elm插入到老节点el的下一个兄弟节点nextSIbling的前面
    // 若nextSiBling为null，insertBefore等价与 appendChild
    parentNode.insertBefore(elm, nextSibling);
    // 删除老节点 oldVnode
    parentNode.removeChild(oldVnode);
    return elm;
  } else {
    // 虚拟节点：做 diff 算法，新老节点比对
    console.log(oldVnode, vnode);
    if (!isSameVnode(oldVnode, vnode)) {
      // 不是相同节点，不考虑复用直接替换
      return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el);
    } else {
      let el = (vnode.el = vnode.el); // 节点复用：将老节点 el 赋值给新节点 el
      if (!oldVnode.tag) {
        // 文本，没有标签名
        if (oldVnode.text !== vnode.text) {
          el.textContent = vnode.text; // 新内容替换老内容
        }
      }
      updateProperties(vnode);
      return el;
    }
  }
}

function createElm(vnode) {
  let { tag, data, children, text, vm } = vnode;
  // 通过tag判断当前节点是元素还是文本
  if (typeof tag == "string") {
    vnode.el = document.createElement(tag);
    updateProperties(vnode, data);
    // 继续处理元素的儿子：递归创建真实节点并添加到对应的父亲上
    children.forEach((child) => {
      vnode.el.appendChild(createElm(child));
    });
  } else {
    vnode.el = document.createTextNode(text); // 创建文本的真实节点
  }

  return vnode.el;
}

function updateProperties(vnode, oldProps = {}) {
  let el = vnode.el; // dom上的真实节点
  let newProps = vnode.data || {}; // 拿到新的数据
  let newStyly = newProps.style || {}; // 新样式对象
  let oldStyly = oldProps.style || {}; // 老样式对象
  // 老样式对象中有，新样式对象中没有，删掉多余样式
  for (let key in oldStyly) {
    if (!newStyly[key]) {
      el.style[key] = "";
    }
  }
  // 新旧比对：两个对象比对差异
  for (let key in newProps) {
    // 直接用新的盖掉老的，但还要注意：老的里面有，可能新的里面没有了
    if (key == "style") {
      // 处理style样式
      for (let key in newStyly) {
        el.style[key] = newStyly[key];
      }
    } else {
      el.setAttribute(key, newProps[key]);
    }
  }
  for (let key in oldProps) {
    if (!newProps[key]) {
      el.removeAttribute(key);
    }
  }
}
