import Watcher from "./observe/watcher";
import { patch } from "./vdom/patch";

export function mountComponent(vm) {
  // vm._render()：调用 render 方法
  // vm._update：将虚拟节点更新到页面上
  let updateComponent = () => {
    vm._update(vm._render());
  };

  new Watcher(
    vm,
    updateComponent,
    () => {
      console.log("Watcher - update");
    },
    true
  );
}

export function lifeCycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;
    // 传入当前真实元素vm.$el，虚拟节点vnode，返回新的真实元素
    vm.$el = patch(vm.$el, vnode);
  };
}
