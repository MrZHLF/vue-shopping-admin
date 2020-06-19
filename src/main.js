import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// import "./plugins/element.js";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

// 引入拖拽排序
import VueDND from "awe-dnd";
Vue.use(VueDND);

import $conf from "./common/config/config.js";

Vue.config.productionTip = false;
Vue.use(ElementUI);

Vue.prototype.$conf = $conf;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
