let routers = [{
    path: "/",
    name: "layout",
    redirect: {
      name: "index"
    },
    component: () => import("../../views/layout.vue"),
    children: [{
      path: "/index",
      name: "index",
      component: () => import("../../views/index/index.vue")
    }]
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../../views/login/index.vue")
  },
  {
    path: "*",
    redirect: {
      name: "index"
    },
  }
];

export default routers;