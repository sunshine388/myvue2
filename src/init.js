import { initState } from "./state";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    console.log(options);
    // 数据的劫持
    // this指向实例
    const vm = this;
    vm.$options = options; // vue中使用this.$options,指代的就是用户传递的属性

    // 初始化状态，包括initProps、initMethod、initData、initComputed、initWatch等
    initState(vm);
    
    // 如果有el属性 进行模板渲染
    if (vm.$options.el) {
      console.log("有el,需要挂载");
    }
  };
}
