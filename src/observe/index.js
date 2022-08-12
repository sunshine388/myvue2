import { isObject, isArray, def } from "../util";
import { arrayMethods } from "./array";
import Dep from "./dep";

class Observer {
  constructor(value) {
    // 如果value是对象，遍历对象中的属性，使用 Object.defineProperty 重新定义
    // value._ob_ = this; // 给每一个监控过的对象都增加一个 _ob_ 属性，代表已经被监控过
    def(value, "_ob_", this);
    if (isArray(value)) {
      // 如果是数组的劫持并不会对索引进行观测，因为会导致性能问题
      // 前端开发很少操作索引，push，pop，shift，unshift

      value.__proto__ = arrayMethods; // 更改数组的原型方法
      // 如果是数组中有对象再对对象进行观测
      this.observerArray(value);
    } else {
      this.walk(value); // 循环对象属性
    }
  }
  observerArray(value) {
    value.forEach((item, index) => {
      observe(item);
    });
  }
  // 循环 data 对象，使用 Object.keys 不循环原型方法
  walk(data) {
    Object.keys(data).forEach((key) => {
      // 使用 Object.defineProperty 重新定义 data 对象中的属性
      defineReactive(data, key, data[key]);
    });
  }
}

/**
 * 给对象Obj，定义属性key，值为value
 *  使用Object.defineProperty重新定义data对象中的属性
 *  由于Object.defineProperty性能低，所以vue2的性能瓶颈也在这里
 * @param {*} obj 需要定义属性的对象
 * @param {*} key 给对象定义的属性名
 * @param {*} value 给对象定义的属性值
 */
function defineReactive(obj, key, value) {
  observe(value); // 递归实现深层观测
  let dep = new Dep();
  Object.defineProperty(obj, key, {
    get() {
      // 视图渲染过程中，会触发数据的取值，如vm.name，进入get方法
      // 如果get方法中的Dep.target有值，就让数据的 dep 记住渲染 watcher
      console.log("取值操作");
      if (Dep.target) {
        dep.depend();
      }
      // 闭包
      return value; // 问题：这里的 value 为什么不用 obj[key]获取？
    },
    set(newValue) {
      if (newValue === value) return;
      console.log("值发生变化了");
      observe(value); //继续劫持用户设置的值，因为用户设置的值可能是个对象
      value = newValue;
      dep.notify(); // 通知当前 dep 中收集的所有 watcher 依次执行视图更新
    },
  });
}

export function observe(value) {
  // 如果 value 不是对象，就不需要观测了，直接 return
  if (!isObject(value)) {
    return;
  }
  // 观测 value 对象，实现数据响应式
  return new Observer(value);
}
