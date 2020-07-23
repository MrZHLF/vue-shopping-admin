import Vue from "vue";
import "./plugins/axios";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";
// import ElementUI from "element-ui";

import { Message, Loading } from "element-ui";

let loading; //定义loading变量

// 显示loading
function showLoading() {
  loading = Loading.service({
    lock: true,
    text: "加载中...",
    background: "rgba(0, 0, 0, 0.7)"
  });
}
// 隐藏loading
function hideLoading() {
  loading.close();
}

// 添加请求拦截器
axios.interceptors.request.use(
  config => {
    // 全局设置token
    showLoading();
    let token = window.sessionStorage.getItem("token");
    if (config.token == true) {
      config.headers["token"] = token;
    }
    return config;
  },
  error => {
    // 对请求错误做些什么
    // 隐藏loading
    hideLoading();
    return Promise.reject(error);
  }
);
// 添加响应拦截器
axios.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    // 隐藏loading
    hideLoading();
    return response;
  },
  err => {
    // 对响应错误做点什么
    if (err.response && err.response.data && err.response.data.errorCode) {
      Message.error(err.response.data.msg);
    }
    // 隐藏loading
    hideLoading();
    return Promise.reject(err);
  }
);

// 引入拖拽排序
import VueDND from "awe-dnd";
Vue.use(VueDND);

import $conf from "./common/config/config.js";

Vue.config.productionTip = false;
// Vue.use(ElementUI);

Vue.prototype.$conf = $conf;

// 自定义指令权限
Vue.directive("auth", {
  inserted(el, binding) {
    let user = window.sessionStorage.getItem("user");
    user = user ? JSON.parse(user) : {};
    if (!user.super) {
      let rules = user.ruleNames ? user.ruleNames : [];
      let v = rules.find(item => item === binding.value);
      if (!v) {
        el.parentNode.removeChild(el);
      }
    }
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
