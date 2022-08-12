// 返回元素虚拟节点
export function createElement(vm, tag, data = {}, ...children) {
  // 返回元素的虚拟节点（元素是没有文本的）
  return vnode(vm, tag, data, children, data.key, undefined);
}

// 返回文本虚拟节点
export function createText(vm, text) {
  // 返回文本的虚拟节点（文本没有标签、数据、儿子、key）
  return vnode(vm, undefined, undefined, undefined, undefined, text);
}
function vnode(vm, tag, data, children, key, text) {
  return {
    vm, // 谁的实例
    tag, // 标签
    data, // 数据
    children, // 儿子
    key, // 标识
    text, // 文本
  };
}

/**
 * 判断两个虚拟节点是否是同一个虚拟节点
 *  逻辑：标签名 和 key 都相同
 * @param {*} newVnode 新虚拟节点
 * @param {*} oldVnode 老虚拟节点
 * @returns
 */
export function isSameVnode(newVnode, oldVnode) {
  return newVnode.tag === oldVnode.tag && newVnode.key === oldVnode.key;
}
