<template>
  <div>
    <el-container class="main">
      <el-header style="background:#545c64"
        ><el-menu
          class="d-flex align-items-center"
          :default-active="navBarIndex"
          mode="horizontal"
          @select="handleSelect"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <a class="h5 text-light mb-0 mr-auto">UNI-ADMIN</a>
          <el-menu-item index="1">首页</el-menu-item>
          <el-menu-item index="2">商品</el-menu-item>
          <el-menu-item index="3">订单</el-menu-item>
          <el-menu-item index="4">会员</el-menu-item>
          <el-menu-item index="5">设置</el-menu-item>
          <el-submenu index="100">
            <template slot="title">
              <el-avatar
                size="small"
                src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
              ></el-avatar>
              summer</template
            >
            <el-menu-item index="100-1">修改</el-menu-item>
            <el-menu-item index="100-2">退出</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-header>
      <el-container style="height:100%;padding-bottom:60px">
        <el-aside width="200px">
          <li v-for="i in 100" :key="i">{{ i }}</li>
        </el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
    <!-- <router-view></router-view> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      navBarIndex: '1',
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    },
  },
}
</script>

<style>
.main {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  overflow: hidden;
}
</style>
