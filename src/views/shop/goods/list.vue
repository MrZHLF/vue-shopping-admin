<template>
  <div
    class="bg-white px-3"
    style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;"
  >
    <el-tabs v-model="tabIndex" @tab-click="handleClick">
      <el-tab-pane
        v-for="(tab, index) in tabbars"
        :key="index"
        :label="tab.name"
      >
        <button-search
          ref="buttonSearch"
          placeholder="要搜索的商品名称"
          @serach="searchEvent"
        >
          <template #left>
            <!-- 左边 -->
            <router-link :to="{ name: 'shop_goods_create' }">
              <el-button type="success" size="mini">发布商品</el-button>
            </router-link>

            <el-button type="warning" size="mini">恢复商品</el-button>
            <el-button type="danger" size="mini">批量删除</el-button>
            <el-button size="mini">上架</el-button>
            <el-button size="mini">下架</el-button>
            <el-button size="mini">推荐</el-button>
          </template>
          <template #form>
            <!-- 表单 -->
            <el-form inline ref="form" :model="form" label-width="80px">
              <el-form-item label="商品名称" class="mb-0">
                <el-input
                  v-model="form.name"
                  size="mini"
                  placeholder="要搜索的商品名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="商品编码" class="mb-0">
                <el-input
                  v-model="form.code"
                  size="mini"
                  placeholder="要搜索的商品编码"
                ></el-input>
              </el-form-item>
              <el-form-item label="商品类型" class="mb-0">
                <el-select
                  v-model="form.type"
                  placeholder="要搜索的商品类型"
                  size="mini"
                >
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="商品分类" class="mb-0">
                <el-input
                  v-model="form.category"
                  size="mini"
                  placeholder="要搜索的商品分类"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="info" size="mini" @click="searchEvent"
                  >搜索</el-button
                >
                <el-button size="mini" @click="clearSearch"
                  >清空筛选条件</el-button
                >
              </el-form-item>
            </el-form>
          </template>
        </button-search>

        <el-table
          :data="tableData[index].list"
          border
          class="mt-3"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="45" align="center">
          </el-table-column>
          <el-table-column prop="title" width="380" label="商品">
            <template slot-scope="scope">
              <div class="media">
                <img
                  class="mr-3"
                  :src="scope.row.cover"
                  style="width: 60px;height: 60px;"
                />
                <div class="media-body">
                  <h5 class="mt-0">{{ scope.row.title }}</h5>
                  <p class="mb-1">分类:{{ scope.row.category }}</p>
                  <p class="mb-0">时间:{{ scope.row.create_time }}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="type" align="center" label="商品类型">
          </el-table-column>
          <el-table-column prop="sale_count" align="center" label="实际销量">
          </el-table-column>
          <el-table-column prop="order" align="center" label="商品排序">
          </el-table-column>
          <el-table-column align="center" label="商品状态">
            <template slot-scope="scope">
              <el-button type="success" @click="scope.row.ischeck = 1" plain
                >审核通过</el-button
              >
              <el-button
                type="danger"
                @click="scope.row.ischeck = 2"
                plain
                class="ml-0 mt-0"
                >审核拒绝</el-button
              >

              <!-- <el-button :type="scope.row.status ? 'success' : 'danger' " size="mini" plain  @click="changeStatus(scope.row)">{{scope.row.status ? '上架' : '下架'}}</el-button> -->
            </template>
          </el-table-column>
          <el-table-column prop="stock" align="center" label="总库存">
          </el-table-column>
          <el-table-column prop="pprice" align="center" label="价格(元)">
          </el-table-column>
          <el-table-column align="center" width="150" label="操作">
            <template slot-scope="scope">
              <el-button-group>
                <el-button type="success" size="mini" plain>编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  plain
                  @click="deleteItem(scope.$index)"
                  >删除</el-button
                >
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <div style="height: 60px;"></div>
        <el-footer
          class="border-top d-flex align-items-center px-0 position-fixed bg-white"
          style="bottom: 0;left: 200px;right: 0;z-index: 100;"
        >
          <div style="flex: 1;" class="p-2">
            <el-pagination
              :current-page="tableData[index].currentPage"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="100"
              layout="total, sizes, prev, pager, next, jumper"
              :total="400"
            >
            </el-pagination>
          </div>
        </el-footer>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import buttonSearch from "@/components/common/button-search.vue";
export default {
  name: "list",
  components: {
    buttonSearch
  },
  data() {
    return {
      tabIndex: 0,
      tabbars: [
        { name: "审核中" },
        { name: "出售中" },
        { name: "已下架" },
        { name: "库存预警" },
        { name: "回收站" }
      ],
      form: {
        name: "",
        code: "",
        type: "",
        category: ""
      },
      tableData: [],
      multipleSelection: [] //多选
    };
  },
  created() {
    this.__getData();
  },
  methods: {
    __getData() {
      for (let i = 0; i < this.tabbars.length; i++) {
        this.tableData.push({
          currentPage: 1,
          list: []
        });
        for (let j = 0; j < 20; j++) {
          this.tableData[i].list.push({
            id: j,
            title: "荣耀 V10全网通 标配版" + i + "-" + j,
            cover: "http://static.yoshop.xany6.com/2018071718294208f086786.jpg",
            create_time: "2019-07-17 18:34:14",
            category: "手机",
            type: "普通商品",
            sale_count: 20,
            order: 100,
            status: 1,
            stock: 200,
            pprice: 1000,
            ischeck: 1
          });
        }
      }
    },
    deleteItem(index) {
      // 删除当前商品
      this.$confirm("是否删除该相册?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.tableData[this.tabIndex].list.splice(index, 1);
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      });
    },
    changeStatus(item) {
      // 修改状态 上下架
      item.status = item.status === 1 ? 0 : 1;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleClick(tab, event) {
      //tab切换
      console.log(tab.index);
    },
    searchEvent(e = false) {
      // 搜索
      if (typeof e === "string") {
        console.log("简单搜索", "4");
        return;
      }
      // 高级搜索
      console.log("高级搜索");
    },
    clearSearch() {
      // 清空筛选条件
      this.form = {
        name: "",
        code: "",
        type: "",
        category: ""
      };
      this.$refs.buttonSearch[this.tabIndex].closeSuperSearch(); //触发子组件方法
    }
  }
};
</script>

<style></style>
