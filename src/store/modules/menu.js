export default {
  state: {
    navBar: {
      active: "0",
      list: []
    }
  },
  mutations: {
    createMenuBar(state, menus) {
      let list = menus.map(item => {
        let submenu = item.child.map(v => {
          return {
            icon: v.icon,
            name: v.name,
            pathname: v.desc
          };
        });
        return {
          name: item.name,
          subActive: "0",
          submenu: submenu
        };
      });
      state.navBar.list = list;
      window.sessionStorage.setItem("navBar", JSON.stringify(state.navBar));
    },
    initNavBar(state) {
      let navBar = window.sessionStorage.getItem("navBar");
      (navBar = navBar
        ? JSON.parse(navBar)
        : {
            active: "0",
            list: []
          }),
        (state.navBar = navBar);
    }
  },
  getters: {
    adminIndex(state) {
      if (state.navBar.list.length === 0) {
        return "error_404";
      }
      let item = state.navBar.list[0].submenu[0];
      if (item) {
        return item.pathname;
      }
    }
  },
  actions: {},
  modules: {}
};
