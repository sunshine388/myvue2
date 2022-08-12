import { isObject, mergeOptions } from "../util";

export function initGlobalAPI(Vue) {
  // 全局属性 options
  // 功能：存放mixins，component，filter、，directive属性
  Vue.options = {};
  Vue.mixin = function (options) {
    this.options = mergeOptions(this.options, options);
    console.log("打印mixins合并后的options、", this.options);
    return this; // 返回this,提供链式调用
  };

  /**
   * 使用基础的 Vue 构造器，创造一个子类
   * @param {*} definition
   */
  Vue.extend = function (definition) {};

  /**
   * Vue.component API
   * @param {*} id          组件名
   * @param {*} definition  组件定义
   */
  Vue.component = function (id, definition) {
    definition.name = definition.name || id;
    // 如果传入的definition是对象
    if (isObject(definition)) {
      definition = Vue.extend(definition);
    }
  };
  // 将 definition 对象保存到全局：Vue.options.components
  Vue.options.components[name] = definition;
  Vue.filte = function (options) {};
  Vue.directive = function (options) {};
}
