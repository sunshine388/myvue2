import { isObject, isArray, def } from "../util";
import { arrayMethods } from "./array";
import Dep from "./dep";

class Observer {
  constructor(value) {
    // 如果value是对象，遍历对象中的属性，使用 Object.defineProperty 重新定义
    // value.__ob__ = this; // 给每一个监控过的对象都增加一个 __ob__ 属性，代表已经被监控过
    def(value, "__ob__", this);
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
  // childOb 是数据组进行观测后返回的结果，内部 new Observe 只处理数组或对象类型
  let childOb = observe(value); // 递归实现深层观测
  let dep = new Dep();
  Object.defineProperty(obj, key, {
    get() {
      // 视图渲染过程中，会触发数据的取值，如vm.name，进入get方法
      // 如果get方法中的Dep.target有值，就让数据的 dep 记住渲染 watcher
      console.log("取值操作");
      if (Dep.target) {
        dep.depend();
        // 数组或对象本身的依赖收集
        if (childOb) {
          // 如果 childOb 有值，说明数据是数组或对象类型
          // observe 方法中，会通过 new Observe 为数组或对象本身添加 dep 属性
          childOb.dep.depend(); // 让数组和对象本身的 dep 记住当前 watcher
          if (Array.isArray(value)) {
            // 如果当前数据是数组类型
            dependArray(value); // 可能数组中继续嵌套数组，需递归处理
          }
        }
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
  // 如果已经是响应式的数据，直接return
  if (value.__ob__) {
    return;
  }
  // 观测 value 对象，实现数据响应式
  return new Observer(value);
}

/**
 * 使数组中的引用类型都进行依赖收集
 * @param {*} value 需要做递归依赖收集的数组
 */
function dependArray(value) {
  // 让数组里的引用类型都收集依赖
  // 数组中如果有对象:[{}]或[[]]，也要做依赖收集（后续会为对象新增属性）
  value.forEach((item) => {
    let current = value[i]; // current 上如果有__ob__，说明是对象，就让 dep 收集依赖（只有对象上才有 __ob__）
    current.__ob__ && current.__ob__.dep.depend();
    // 如果内部还是数组，继续递归处理
    if (Array.isArray(current)) {
      dependArray(current);
    }
  });
}
