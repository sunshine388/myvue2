import { isObject } from "../util";

// 返回元素虚拟节点
export function createElement(vm, tag, data = {}, ...children) {
  if (!isReservedTag(tag)) {
    // 组件
    // 获取组件的构造函数:之前已经保存到了全局 vm.$options.components 上；
    let Ctor = vm.$options.components[tag];
    // 创建组件的虚拟节点
    return createComponent(vm, tag, data, children, data.key, Ctor);
  }
  // 返回元素的虚拟节点（元素是没有文本的）
  return vnode(vm, tag, data, children, data.key, undefined);
}
/**
 * 创造组件的虚拟节点 componentVnode
 */
function createComponent(vm, tag, data, children, key, Ctor) {
  if (isObject(Ctor)) {
    // 获取 Vue 并通过 Vue.extend 将对象处理成为组件的构造函数
    Ctor = vm.$options._base.extend(Ctor);
  }

  // 创建 vnode 时,组件是没有文本的,需要传入 undefined
  let componentVnode = vnode(vm, tag, data, children, key, undefined, {Ctor, children, tag});
  return componentVnode;
}
// 返回文本虚拟节点
export function createText(vm, text) {
  // 返回文本的虚拟节点（文本没有标签、数据、儿子、key）
  return vnode(vm, undefined, undefined, undefined, undefined, text);
}
function vnode(vm, tag, data, children, key, text, options) {
  return {
    vm, // 谁的实例
    tag, // 标签
    data, // 数据
    children, // 儿子
    key, // 标识
    text, // 文本
    componentOptions: options, // 组件的选项，包含 Ctor 及其他扩展项
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

// 判定包含关系
function makeMap(str) {
  let tagList = str.split(",");
  return function (tagName) {
    return tagList.includes(tagName);
  };
}

// 原始标签
export const isReservedTag = makeMap(
  "template,script,style,element,content,slot,link,meta,svg,view,button," +
    "a,div,img,image,text,span,input,switch,textarea,spinner,select," +
    "slider,slider-neighbor,indicator,canvas," +
    "list,cell,header,loading,loading-indicator,refresh,scrollable,scroller," +
    "video,web,embed,tabbar,tabheader,datepicker,timepicker,marquee,countdown"
);
