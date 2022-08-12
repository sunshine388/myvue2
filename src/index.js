import { initGlobalAPI } from "./global-api";
import { initMixin } from "./init";
import { lifeCycleMixin } from "./lifecycle";
import { renderMixin } from "./render";

function Vue(options) {
  // new Vue创建实例时会调用_init()方法
  this._init(options);
}

initMixin(Vue);
renderMixin(Vue);
lifeCycleMixin(Vue);
initGlobalAPI(Vue);

export default Vue;
