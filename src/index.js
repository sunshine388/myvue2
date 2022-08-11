import { initMixin } from "./init";
import { renderMixin } from "./render";

function Vue(options) {
  // new Vue创建实例时会调用_init()方法
  this._init(options);
}

initMixin(Vue);
renderMixin(Vue);

export default Vue;
