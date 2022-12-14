import { initState } from "./state";
import { complieToFuction } from "./complier";
import { callHook, mountComponent } from "./lifecycle";
import { mergeOptions, nextTick } from "./util";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    // 数据的劫持
    // this指向实例
    const vm = this;
    // 此时需使用 options 与 mixin 合并后的全局 options 再进行一次合并
    vm.$options = mergeOptions(vm.constructor.options, options); // vue中使用this.$options,指代的就是用户传递的属性
    callHook(vm, "beforeCreate");
    // 初始化状态，包括initProps、initMethod、initData、initComputed、initWatch等
    initState(vm);
    callHook(vm, "created");
    // 如果有el属性 进行模板渲染
    if (vm.$options.el) {
      console.log("有el,需要挂载");
      vm.$mount(vm.$options.el);
    }
  };
  Vue.prototype.$mount = function (el) {
    const vm = this;
    const opts = vm.$options;
    el = document.querySelector(el);
    vm.$el = el;
    // 默认会查找有没有render，没有就template，没有template就采用el中的内容
    if (!opts.render) {
      let template = opts.template;
      if (!template && el) {
        template = el.outerHTML;
      }
      // 需要将template转换为render
      const render = complieToFuction(template);
      opts.render = render;
    }

    // 将当前render渲染到el元素上
    mountComponent(vm);
  };
  Vue.prototype.$nextTick = nextTick;
}
