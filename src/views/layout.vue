<template>
  <div>
    <el-container class="main">
      <el-header style="background:#545c64">
        <el-menu class="d-flex align-items-center"
                 :default-active="slideMenusActive"
                 mode="horizontal"
                 @select="handleSelect"
                 background-color="#545c64"
                 text-color="#fff"
                 active-text-color="#ffd04b">
          <a class="h5 text-light mb-0 mr-auto">{{$conf.logo}}</a>
          <el-menu-item :index="index | numToString"
                        v-for="(item, index) in navBar.list"
                        :key="index">{{ item.name }}</el-menu-item>
          <el-submenu index="100">
            <template slot="title">
              <el-avatar size="small"
                         src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"></el-avatar>
              summer
            </template>
            <el-menu-item index="100-1">修改</el-menu-item>
            <el-menu-item index="100-2">退出</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-header>
      <el-container style="height:100%;">
        <el-aside style="width:200px;border-right: solid 1px #e6e6e6;">
          <el-menu default-active="0"
                   @select="slideSelect">
            <el-menu-item :index="index | numToString"
                          v-for="(item,index) in slideMenus"
                          :key="index">
              <i :class="item.icon"></i>
              <span slot="title">{{item.name}}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main class="bg-light" style="padding-bottom: 60px;position: relative;">
          <!-- 面包屑导航 -->
          <div class="border-bottom mb-3 bg-white"
               style="padding:20px;margin:-20px;"
               v-if="bran.length > 0">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item v-for="(item,index) in bran"
                                  :key="index"
                                  :to="{ path: item.path }">{{item.title}}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <router-view></router-view>
          <el-backtop target=".el-main"
                      :bottom="100">
            <div style="
              height: 100%;
              width: 100%;
              background-color: #f2f5f6;
              box-shadow: 0 0 6px rgba(0,0,0, .12);
              text-align: center;
              line-height: 40px;
              color: #1989fa;
            ">
              UP
            </div>
          </el-backtop>
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>

<script>
import common from '@/common/mixins/common.js'
export default {
  mixins: [common],
  data () {
    return {
      navBar: [],
      bran: []
    }
  },
  created () {
    this.navBar = this.$conf.navBar
    // 获取面包屑导航
    this.getRouterBran()
    //初始化选中菜单
    //刷新保持导航栏
    this._initNavBar()
  },
  watch: {
    '$route'(to, from) {
			// 本地存储
			localStorage.setItem('navActive',JSON.stringify({
				top:this.navBar.active || '0',
				left:this.slideMenuActive || '0'
			}))
			this.getRouterBran()
	}
  },
  computed: {
    slideMenusActive: {
      get () {
        return this.navBar.list[this.navBar.active].subActive || '0'
      },
      set (val) {
        this.navBar.list[this.navBar.active].subActive = val
      }

    },
    slideMenus () {
      return this.navBar.list[this.navBar.active].submen || []
    }
  },
  methods: {
    _initNavBar () {
      //刷新浏览器保持选中状态
      let r = localStorage.getItem('navActive')
      if (r) {
        r = JSON.parse(r)
        this.navBar.active = r.top;
        this.slideMenusActive = r.left;
      }
    },
    getRouterBran () {
      // 获取面包屑导航
      let b = this.$route.matched.filter(v => v.name)
      let arr = [];
      b.forEach((v, k) => {
        // 过滤index
        if (v.name === 'index' || v.name === 'layout') return
        arr.push({
          name: v.name,
          path: v.path,
          title: v.meta.title
        })
      })
      if (arr.length > 0) {
        arr.unshift({ name: 'index', path: '/index', title: "后台首页" })
      }
      this.bran = arr
    },
    handleSelect (key, keyPath) {
		if(key == '100-1'){
			return console.log('修改资料')
		}
		if(key == '100-2'){
			return console.log('退出')
		}
		
      this.navBar.active = key;
      //默认选择第一个
      this.slideMenusActive = '0';
      if (this.slideMenus.length > 0) {
        this.$router.push({
          name: this.slideMenus[this.slideMenusActive].pathname
        })
      }

    },
    slideSelect (key, keyPath) {
      this.slideMenusActive = key
      // 跳转指定页面
      this.$router.push({
        name: this.slideMenus[key].pathname
      })

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
