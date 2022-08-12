// 拿到数组的原型方法
let oldArrayPrototype = Array.prototype;
// 原型继承，将原型链向后移动 arrayMethods.__proto__ == oldArrayPrototype
export let arrayMethods = Object.create(oldArrayPrototype);

// 重写能够导致原数组变化的七个方法
let methods = ["push", "pop", "shift", "unshift", "reverse", "sort", "splice"];

// 在数组自身上进行方法重写，对链上的同名方法进行拦截
methods.forEach((method) => {
  arrayMethods[method] = function (...args) {
    console.log("数组的方法进行重写操作 method = " + method);
    const result = oldArrayPrototype[method].apply(this, args); // 调用原生数组方法

    let inserted;
    let ob = this.__ob__;
    switch (method) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case "splice":
        inserted = args.slice(2);
      default:
        break;
    }
    if (inserted) ob.observerArray(inserted);
    ob.dep.notify(); // 通过 ob 拿到 dep，调用 notify 触发 watcher 做视图更新
    return result;
  };
});
