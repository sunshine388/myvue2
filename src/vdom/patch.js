/**
 * 将虚拟节点转为真实节点后插入到元素中
 * @param {*} el    当前真实元素 id#app
 * @param {*} vnode 虚拟节点
 * @returns         新的真实元素
 */
export function patch(el, vnode) {
  // 1.根据虚拟节点创建真实节点
  const elm = createElm(vnode);
  // 2.使用真实节点替换虚拟节点
  console.log("生成的真实dom节点：", elm);
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
