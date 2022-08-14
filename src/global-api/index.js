import { isObject, mergeOptions } from "../util";

export function initGlobalAPI(Vue) {
  // 全局属性 options
  // 功能：存放mixins，component，filter、，directive属性
  Vue.options = {};
  // 当组件初始化时，会使用 Vue.options 和组件 options 进行合并;
  // 在这个过程中，_base 也会被合并到组件的 options 上;
  // 之后所有的 vm.$options 就都可以取到 _base 即 Vue;
  // 这样,在任何地方访问 vm.$options._base 都可以拿到 Vue;
  Vue.options._base = Vue;
  Vue.options.components = {}; // 存放全局组件

  Vue.mixin = function (options) {
    this.options = mergeOptions(this.options, options);
    console.log("打印mixins合并后的options、", this.options);
    return this; // 返回this,提供链式调用
  };

  /**
   * 使用基础的 Vue 构造器，创造一个子类
   * @param {*} definition
   */
  Vue.extend = function (definition) {
    // 父类Vue即当前this;
    const Super = this;
    // 创建子类sub
    const Sub = function (options) {
      // 当 new 组件时，执行组件初始化
      this._init(options);
    };
    // 继承 Vue 的原型方法:Sub.prototype.__proto__ = Supper.prototype（父类的原型）
    Sub.prototype = Object.create(Super.prototype);
    // 修复 constructor 指向问题：Object.create 会产生一个新的实例作为子类的原型，导致constructor指向错误
    Sub.prototype.constructor = Sub;
    return Sub;
  };

  /**
   * Vue.component API
   * @param {*} id          组件名
   * @param {*} definition  组件定义
   */
  Vue.component = function (id, definition) {
    const name = definition.name || id;
    // 如果传入的definition是对象
    if (isObject(definition)) {
      definition = Vue.extend(definition);
    }
    // 将 definition 对象保存到全局：Vue.options.components
    Vue.options.components[name] = definition;
  };
  Vue.filte = function (options) {};
  Vue.directive = function (options) {};
}
