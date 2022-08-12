export function isObject(val) {
  return typeof val == "object" && val !== null;
}
export function isFunction(val) {
  return typeof val == "function";
}
export function isArray(val) {
  return Array.isArray(val);
}
export function def(data, key, value) {
  Object.defineProperty(data, key, {
    enumerable: false,
    configurable: false,
    value: value,
  });
}

let callbacks = []; // 缓存异步更新的 nextTick
let waiting = false;
function flushsCallbacks() {
  callbacks.forEach((fn) => fn());
  callbacks = [];
  waiting = false;
}

/**
 * 将方法异步化
 * @param {*} fn 需要异步化的方法
 * @returns
 */
export function nextTick(fn) {
  // return Promise.resolve().then(fn);
  callbacks.push(fn); // 先缓存异步更新的 nextTick
  if (!waiting) {
    Promise.resolve().then(flushsCallbacks);
    waiting = true;
  }
}
