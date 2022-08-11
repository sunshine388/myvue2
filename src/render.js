import { isObject } from "./util";
import { createElement, createText } from "./vdom";

export function renderMixin(Vue) {
  Vue.prototype._c = function (tag, data, ...childerns) {
    const vm = this;
    return createElement(vm, tag, data, childerns);
  };
  Vue.prototype._v = function (text) {
    const vm = this;
    return createText(vm, text); // vm作用： 确定虚拟节点所属示例
  };
  Vue.prototype._s = function (val) {
    if (isObject(val)) {
      return JSON.stringify(val);
    } else {
      return val;
    }
  };
  Vue.prototype._render = function () {
    const vm = this;
    let { render } = vm.$options;
    let vnode = render.call(vm); // 此时内部会调用_c,_v,_s方法，执行完成返回虚拟节点
    console.log("生成的虚拟节点：", vnode);
    return vnode;
  };
}
