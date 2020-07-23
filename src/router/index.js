import Vue from "vue";
import Router from "vue-router";

import routes from "./../common/config/router";

Vue.use(Router);

let router = new Router({
  routes
});

router.beforeEach((to, from, next) => {
  console.log(to, from);
  let token = window.sessionStorage.getItem("token");
  if (token) {
    // 已登录
    if (to.path === "/login") {
      Vue.prototype.$message.error("请不用重复登录");
      return next({ name: from.name ? from.name : "index" });
    }

    // 页面权限验证
    if (to.name !== "error_404") {
      let rules = window.sessionStorage.getItem("rules");
      rules = rules ? JSON.parse(rules) : [];
      let index = rules.findIndex(item => {
        return item.rule_id > 0 && item.desc === to.name;
      });
      if (index === -1) {
        Vue.prototype.$message.error("你没有权限访问");
        return next({ name: from.name ? from.name : "error_404" });
      }
    }
    next();
  } else {
    // 未登录
    if (to.path === "/login") {
      return next();
    }
    Vue.prototype.$message.error("请先登录");
    next({ path: "/login" });
  }
});

export default router;
