import Dep from "./dep";

class Watcher {
  constructor(vm, fn, cb, options) {
    this.vm = vm;
    this.fn = fn;
    this.cb = cb;
    this.options = options;
    this.gettter = fn; // fn 为页面渲染逻辑
    this.get();
  }

  get() {
    Dep.target = this; // 在触发视图渲染前，将 watcher 记录到 Dep.target 上
    this.gettter(); // 调用页面渲染逻辑  vm._update(vm._render());
    Dep.target = null; // 渲染完成后，清除watcher记录
  }
}

export default Watcher;
