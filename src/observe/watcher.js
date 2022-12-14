import Dep from "./dep";
import { queueWatcher } from "./schedule";

let id = 0;
class Watcher {
  constructor(vm, fn, cb, options) {
    this.vm = vm;
    this.fn = fn;
    this.cb = cb;
    this.options = options;

    this.id = id++; // watcher唯一标记
    this.depsId = new Set(); // 用于当前 watcher 保存 dep 实例的唯一id
    this.deps = []; // 用于当前 watcher 保存 dep 实例
    this.gettter = fn; // fn 为页面渲染逻辑
    this.get();
  }
  addDep(dep) {
    let did = dep.id;
    // dep 查重
    if (!this.depsId.has(did)) {
      // 让 watcher 记住dep;
      this.depsId.add(did);
      this.deps.push(dep);
      // 让 dep 也记住watcher
      dep.addSub(this);
    }
  }
  get() {
    Dep.target = this; // 在触发视图渲染前，将 watcher 记录到 Dep.target 上
    this.gettter(); // 调用页面渲染逻辑  vm._update(vm._render());
    Dep.target = null; // 渲染完成后，清除watcher记录
  }
  // 执行视图更新
  update() {
    console.log("watcher-update", "查重并缓存需要更新的 watcher");
    queueWatcher(this);
  }

  run() {
    console.log("watcher-run", "真正执行视图更新");
    this.get();
  }
}

export default Watcher;
