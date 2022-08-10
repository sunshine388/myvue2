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
