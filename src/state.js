import { observe } from "./observe";
import { isFunction } from "./util";

export function initState(vm) {
  const opts = vm.$options;
  if (opts.props) {
    initProps(vm);
  }
  if (opts.methods) {
    initMethod(vm);
  }
  if (opts.data) {
    // 初始化data
    initData(vm);
  }
  if (opts.computed) {
    initComputed(vm);
  }
  if (opts.watch) {
    initWatch(vm);
  }

  function initProps() {}
  function initMethod() {}
  function initData(vm) {
    console.log("进入 state.js - initData，数据初始化操作");
    let data = vm.$options.data;
    data = vm._data = isFunction(data) ? data.call(vm) : data;

    // 对象劫持，用户改变数据，得到通知
    // Object.defineProperty，重写data上的所有属性，给属性增加get和set方法
    observe(data); // 使用 observe 实现 data 数据的响应式

    // 当 vm.message 在 vm 实例上取值时，将它代理到vm._data上去取
    for (let key in data) {
      Proxy(vm, key, "_data");
    }
  }

  function initComputed() {}
  function initWatch() {}
}
/**
 * 代理方法
 *  当取 vm.key 时，将它代理到 vm._data上去取
 * @param {*} vm        vm 实例
 * @param {*} key       属性名
 * @param {*} source    代理目标，这里是vm._data
 */
function Proxy(vm, key, source) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key];
    },
    set(newValue) {
      vm[source][key] = newValue;
    },
  });
}
