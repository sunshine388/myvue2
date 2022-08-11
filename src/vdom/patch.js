/**
 * 将虚拟节点转为真实节点后插入到元素中
 * @param {*} el    当前真实元素 id#app
 * @param {*} vnode 虚拟节点
 * @returns         新的真实元素
 */
export function patch(el, vnode) {
  // 1.根据虚拟节点创建真实节点
  const elm = createElm(vnode);
  console.log("生成的真实dom节点：", elm);
  // 2.使用真实节点替换原来的老节点
  const parentNode = el.parentNode;
  // 找到老节点的下一个兄弟节点，（nextSiBling 若不存在将返回null)
  const nextSibling = el.nextSibling;
  // 将新节点elm插入到老节点el的下一个兄弟节点nextSIbling的前面
  // 若nextSiBling为null，insertBefore等价与 appendChild
  parentNode.insertBefore(elm, nextSibling);
  // 删除老节点 el
  parentNode.removeChild(el);
  return elm;
}

function createElm(vnode) {
  let { tag, data, children, text, vm } = vnode;
  // 通过tag判断当前节点是元素还是文本
  if (typeof tag == "string") {
    vnode.el = document.createElement(tag);
    updateProperties(vnode.el, data);
    // 继续处理元素的儿子：递归创建真实节点并添加到对应的父亲上
    children.forEach((child) => {
      vnode.el.appendChild(createElm(child));
    });
  } else {
    vnode.el = document.createTextNode(text); // 创建文本的真实节点
  }

  return vnode.el;
}

function updateProperties(el, props = {}) {
  for (let key in props) {
    if (key == "style") {
      // 设置元素的样式
      for (const styleName in props.style) {
        el.style[styleName] = props.style[styleName];
      }
    } else {
      el.setAttribute(key, props[key]);
    }
  }
}
