<template>
  <div
    class="bg-white px-3"
    style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;"
  >
    <el-tabs v-model="tabIndex" @tab-click="getList"
      ><el-tab-pane
        v-for="(tab, index) in tabbars"
        :key="index"
        :label="tab.name"
      ></el-tab-pane
    ></el-tabs>
    <button-search
      ref="buttonSearch"
      placeholder="要搜索的商品名称"
      @search="searchEvent"
    >
      <template #left>
        <!-- 左边 -->
        <router-link :to="{ name: 'shop_goods_create' }" class="mr-2"
          ><el-button type="success" size="mini"
            >发布商品</el-button
          ></router-link
        >

        <el-button
          type="warning"
          v-if="tab === 'delete'"
          size="mini"
          @click="doEvent('restore')"
          >恢复商品</el-button
        >
        <el-button
          type="danger"
          size="mini"
          v-if="tab === 'delete'"
          @click="doEvent('destroy')"
          >彻底删除</el-button
        >
        <el-button
          type="danger"
          size="mini"
          v-if="tab != 'delete'"
          @click="deleteAll"
          >批量删除</el-button
        >
        <el-button
          size="mini"
          v-if="tab === 'all' || tab === 'off'"
          @click="changeStatus(1)"
          >上架</el-button
        >
        <el-button
          size="mini"
          v-if="tab === 'all' || tab === 'saling'"
          @click="changeStatus(0)"
          >下架</el-button
        >
      </template>
      <template #form>
        <!-- 表单 -->
        <el-form inline ref="form" :model="form" label-width="80px">
          <el-form-item label="商品名称" class="mb-0"
            ><el-input
              v-model="form.title"
              size="mini"
              placeholder="要搜索的商品名称"
            ></el-input
          ></el-form-item>
          <el-form-item label="商品分类" class="mb-0">
            <el-select
              v-model="form.category_id"
              size="mini"
              placeholder="要搜索的商品分类"
            >
              <el-option
                v-for="item in cateOptions"
                :key="item.id"
                :label="item | tree"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="info" size="mini" @click="searchEvent"
              >搜索</el-button
            >
            <el-button size="mini" @click="clearSearch">清空筛选条件</el-button>
          </el-form-item>
        </el-form>
      </template>
    </button-search>

    <el-table
      :data="tableData"
      border
      class="mt-3"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="45"
        align="center"
      ></el-table-column>
      <el-table-column prop="title" width="300" label="商品">
        <template slot-scope="scope">
          <div class="media">
            <img
              class="mr-3"
              :src="scope.row.cover"
              style="width: 60px;height: 60px;"
            />
            <div class="media-body">
              <h5 class="mt-0">{{ scope.row.title }}</h5>
              <p class="mb-1">分类:{{ scope.row.category.name }}</p>
              <p class="mb-0">时间:{{ scope.row.create_time }}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="sale_count"
        width="70"
        align="center"
        label="实际销量"
      ></el-table-column>
      <el-table-column align="center" label="商品状态">
        <template slot-scope="scope">
          <span
            class="badge"
            :class="scope.row.status ? 'badge-success' : 'badge-danger'"
            >{{ scope.row.status ? "上架" : "仓库" }}</span
          >
        </template>
      </el-table-column>
      <el-table-column align="center" width="120" label="审核状态">
        <template slot-scope="scope">
          <div class="d-flex flex-column" v-if="!scope.row.ischeck">
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
          </div>
          <span v-else>{{ scope.row.ischeck === 1 ? "通过" : "拒绝" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="stock"
        align="center"
        width="80"
        label="总库存"
      ></el-table-column>
      <el-table-column align="center" width="120" label="价格(元)">
        <template slot-scope="scope">
          <span class="text-danger">{{ scope.row.min_price }}</span>
          <span>/</span>
          <span class="text-muted">{{ scope.row.min_oprice }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="navigate('shop_goods_create', scope.row.id)"
            >基础设置</el-button
          >
          <el-button
            type="text"
            size="mini"
            @click="navigate('shop_goods_sku', scope.row.id)"
            :class="
              (scope.row.sku_type == 0 && !scope.row.sku_value) ||
              (scope.row.sku_type == 1 && !scope.row.goods_skus.length)
                ? 'text-danger'
                : ''
            "
          >
            商品规格
          </el-button>
          <el-button
            type="text"
            size="mini"
            :class="scope.row.goods_attrs.length == 0 ? 'text-danger' : ''"
            @click="navigate('shop_goods_attr', scope.row.id)"
            >商品属性</el-button
          >
          <el-button
            type="text"
            size="mini"
            :class="scope.row.goods_banner.length == 0 ? 'text-danger' : ''"
            @click="navigate('shop_goods_banner', scope.row.id)"
            >媒体设置</el-button
          >
          <el-button
            type="text"
            size="mini"
            :class="!scope.row.content ? 'text-danger' : ''"
            @click="navigate('shop_goods_content', scope.row.id)"
            >商品详情</el-button
          >
          <el-button type="text" size="mini">折扣设置</el-button>
          <el-button type="text" size="mini">删除商品</el-button>
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
          :current-page="page.current"
          :page-sizes="page.sizes"
          :page-size="page.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </el-footer>
  </div>
</template>
<script>
import buttonSearch from "@/components/common/button-search.vue";
import common from "@/common/mixins/common.js";
export default {
  name: "list",
  mixins: [common],
  inject: ["layout"],
  components: {
    buttonSearch
  },
  data() {
    return {
      preUrl: "goods",
      tabIndex: 0,
      tabbars: [
        { name: "全部", key: "all" },
        { name: "审核中", key: "checking" },
        { name: "出售中", key: "saling" },
        { name: "已下架", key: "off" },
        { name: "库存预警", key: "min_stock" },
        { name: "回收站", key: "delete" }
      ],
      form: {
        title: "",
        category_id: ""
      },
      tableData: [],
      cateOptions: []
    };
  },
  filters: {
    tree(item) {
      if (item.level == 0) {
        return item.name;
      }
      let str = "";
      for (let i = 0; i < item.level; i++) {
        str += i == 0 ? "|--" : "--";
      }
      return str + " " + item.name;
    }
  },
  computed: {
    tab() {
      return this.tabbars[this.tabIndex].key;
    },
    params() {
      let str = "";
      for (let key in this.form) {
        let val = this.form[key];
        if (val) {
          str += `&${key}=${this.form[key]}`;
        }
      }
      return str;
    }
  },
  methods: {
    getListUrl() {
      //处理url以及参数
      return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}&tab=${this.tab}${this.params}`;
    },
    getListResult(e) {
      // 从mixins接受的数据
      this.tableData = e.list;
      this.cateOptions = e.cates;
      console.log(e);
    },
    changeStatus(item) {
      // 修改状态 上下架
      item.status = item.status === 1 ? 0 : 1;
    },
    searchEvent(e = false) {
      // 搜索
      if (typeof e === "string") {
        console.log(3);
        this.form.title = e;
        this.getList();
        return;
      }
      this.getList();
      // 高级搜索
      console.log("高级搜索");
    },
    clearSearch() {
      // 清空筛选条件
      this.form = {
        title: "",
        category_id: ""
      };
    },
    doEvent(key) {
      console.log(key);
      if (this.ids.length === 0) {
        return this.$message({
          message: "请选择要操作的商品",
          type: "error"
        });
      }
      this.layout.showLoading();
      let desc = key === "destroy" ? "商品删除成功" : "商品恢复成功";
      this.axios
        .post(
          "/admin/goods/" + key,
          {
            ids: this.ids
          },
          { token: true }
        )
        .then(res => {
          this.$message({
            message: desc,
            type: "success"
          });
          this.getList();
          this.layout.hideLoading();
        })
        .catch(err => {
          this.layout.hideLoading();
        });
    },
    changeStatus(status) {
      if (this.ids.length === 0) {
        return this.$message({
          message: "请选择要操作的商品",
          type: "error"
        });
      }
      this.layout.showLoading();
      this.axios
        .post(
          "/admin/goods/changestatus",
          {
            ids: this.ids,
            status
          },
          { token: true }
        )
        .then(res => {
          this.$message({
            message: status === 1 ? "商品上架成功" : "商品下架成功",
            type: "success"
          });
          this.getList();
          this.layout.hideLoading();
        })
        .catch(err => {
          this.layout.hideLoading();
        });
    },
    navigate(name, id) {
      this.$router.push({
        name,
        params: { id }
      });
    }
  }
};
</script>

<style></style>
