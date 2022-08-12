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
    console.log("新老节点对比", oldVnode, vnode);
    if (!isSameVnode(oldVnode, vnode)) {
      // 不是相同节点，不考虑复用直接替换
      return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el);
    } else {
      let el = (vnode.el = oldVnode.el); // 节点复用：将老节点 el 赋值给新节点 el
      if (!oldVnode.tag) {
        // 文本，没有标签名
        if (oldVnode.text !== vnode.text) {
          el.textContent = vnode.text; // 新内容替换老内容
        }
      }
      // 元素的处理：相同节点，且新老节点不都是文本时
      updateProperties(vnode, oldVnode.data);

      // 比较儿子节点...
      let oldChildren = oldVnode.children || [];
      let newChildren = vnode.children || [];
      // 情况 1：老的有儿子，新的没有儿子；直接将多余的老 dom 元素删除即可；
      if (oldChildren.length > 0 && newChildren.length == 0) {
        // 更好的处理：由于子节点中可能包含组件，需要封装removeChildNodes方法，将子节点全部删掉
        el.innerHTML = ""; // 暴力写法直接清空；
      } else if (oldChildren.length == 0 && newChildren.length > 0) {
        newChildren.forEach((child) => {
          // 注意：这里的child是虚拟节点，需要变为真实节点
          let childElm = createElm(child); // 根据新的虚拟节点，创建一个真实节点
          el.appendChild(childElm); // 将生成的真实节点，放入 dom
        });
      } else {
        // diff 比对的核心逻辑
        updateChildren(el, oldChildren, newChildren);
      }
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

/**
 * 新老都有儿子时做比对，即 diff 算法核心逻辑
 * 备注：采用头尾双指针的方式；优化头头、尾尾、头尾、尾头的特殊情况；
 * @param {*} el
 * @param {*} oldChildren  老的儿子节点
 * @param {*} newChildren  新的儿子节点
 */

function updateChildren(el, oldChildren, newChildren) {
  // 申明头尾指针
  let oldStartIndex = 0;
  let oldStartVnode = oldChildren[0];
  let oldEndIndex = oldChildren.length - 1;
  let oldEndVnode = oldChildren[oldEndIndex];

  let newStartIndex = 0;
  let newStartVnode = newChildren[0];
  let newEndIndex = newChildren.length - 1;
  let newEndVnode = newChildren[newEndIndex];

  /**
   * 根据children创建映射
   */
  function makeKeyByIndex(children) {
    let map = {};
    children.forEach((item, index) => {
      item.key && (map[item.key] = index);
    });
    return map;
  }

  let mapping = makeKeyByIndex(oldChildren);
  // 循环结束条件：有一方遍历完了就结束；即"老的头指针和尾指针重合"或"新的头指针和尾指针重合"
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    // 1，优先做4种特殊情况比对：头头、尾尾、头尾、尾头
    // 2，如果没有命中，采用乱序比对
    // 3，比对完成后移动指针，继续下一轮比对

    // 当前循环开始时，先处理当前的oldStartVnode和oldEndVnode为空的情况；
    // 原因：节点之前被移走时置空，直接跳过
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIndex];
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIndex];
    } else if (isSameVnode(oldStartVnode, newStartVnode)) {
      // isSameVnode只能判断标签和key一样，但属性可能还有不同
      // 所以需要patch方法递归更新新老虚拟节点的属性
      patch(oldStartVnode, newStartVnode);
      // 更新新老头指针和新老头节点
      oldStartVnode = oldChildren[++oldStartIndex];
      newStartVnode = newChildren[++newStartIndex];
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      patch(oldEndVnode, newEndVnode);
      oldEndVnode = oldChildren[--oldEndIndex];
      newEndVnode = newChildren[--newEndIndex];
      // 头尾比较：老的头节点和新的尾节点做对比
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      // patch方法只会duff比较并更新属性，但元素的位置不会变化
      patch(oldStartVnode, newEndVnode); // diff:包括递归比儿子
      // 移动节点：将当前的节点插入到最后一个节点的下一个节点的前面去
      el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
      // 移动指针
      oldStartVnode = oldChildren[++oldStartIndex];
      newEndVnode = newChildren[--newEndIndex];
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      patch(oldEndVnode, newStartVnode); // patch方法只会更新属性，元素的位置不会变化
      // 移动节点:将老的尾节点移动到老的头节点前面去
      el.insertBefore(oldEndVnode.el, oldStartVnode.el); // 将尾部插入到头部
      // 移动指针
      oldEndVnode = oldChildren[--oldEndIndex];
      newStartVnode = newChildren[++newStartIndex];
    } else {
      // 前面4种逻辑（头头、尾尾、头尾、尾头）,主要是考虑到用户使用时的一些特殊场景，但也有非特殊情况，如：乱序排序
      // 筛查当前新的头指针对应的节点在mapping中是否存在

      let moveIndex = mapping[newStartVnode.key];
      if (moveIndex == undefined) {
        // 没有，将当前比对的新节点插入到老的头指针对用的节点前面
        // 将当前新的虚拟节点创建为真实节点，插入到老的开始节点前面
        el.insertBefore(createElm(newStartVnode), oldStartVnode.el);
      } else {
        // 有,需要复用
        // 将当前比对的老节点移动到老的头指针前面
        let moveVnode = oldChildren[moveIndex]; // 从老的队列中找到可以被复用的这个节点
        el.insertBefore(moveVnode.el, oldStartVnode.el);
        // 复用：位置移动完成后，还要对比并更新属性
        patch(moveVnode, oldStartVnode);
        // 由于复用的节点在oldChildren中被移走了,之前的位置要标记为空(指针移动时，跳过会使用)
        oldChildren[moveIndex] = undefined;
      }
      // 每次处理完成后，新节点的头指针都需要向后移动
      // 备注：
      //     无论节点是否可复用，新指针都会向后移动，所以最后统一处理；
      //    节点可复用时，老节点的指针移动会在4种特殊情况中被处理完成；
      newStartVnode = newChildren[++newStartIndex];
    }
  }

  // 比对完成后
  // 新的多，插入新增节点，删除多余节点
  if (newStartIndex <= newEndIndex) {
    // 新的开始指针和新的结束指针之间的节点
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      // 判断当前尾节点的下一个元素是否存在：
      //  1，如果存在：则插入到下一个元素的前面
      //  2，如果不存在（下一个是 null） ：就是 appendChild
      // 取参考节点 anchor:决定新节点放到前边还是后边
      //  逻辑：取去newChildren的尾部+1,判断是否为 null
      //  解释：如果有值说明是向前移动的，取出此虚拟元素的真实节点el，将新节点添加到此真实节点前即可
      let anchor =
        newChildren[newEndIndex + 1] == null
          ? null
          : newChildren[newEndIndex + 1].el;
      // 获取对应的虚拟节点，并生成真实节点，添加到 dom 中
      // el.appendChild(createElm(newChildren[i]))
      // 逻辑合并:将 appendChild 改为 insertBefore
      //  效果：既有appendChild又有insertBefore的功能，直接将参考节点放进来即可;
      //  解释：对于insertBefore方法,如果anchor为null，等同于appendChild;如果有值，则是insertBefore;
      el.insertBefore(createElm(newChildren[i]), anchor);
    }
  }

  // 2，老儿子比新儿子多，（以旧指针为参照）删除多余的真实节点
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      let child = oldChildren[i];
      child && el.removeChild(child.el);
    }
  }
}
