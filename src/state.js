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
  }

  function initComputed() {}
  function initWatch() {}
}
