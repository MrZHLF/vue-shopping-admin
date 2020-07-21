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
          placeholder="要搜索的订单编号"
          @serach="searchEvent"
        >
          <template #left>
            <!-- 左边 -->
            <el-button type="success" size="mini">导出数据</el-button>
            <el-button type="danger" size="mini">批量删除</el-button>
          </template>
          <template #form>
            <!-- 表单 -->
            <el-form inline ref="form" :model="form" label-width="80px">
              <el-form-item label="订单编号" class="mb-0">
                <el-input
                  v-model="form.code"
                  size="mini"
                  placeholder="要搜索的订单编号"
                ></el-input>
              </el-form-item>
              <el-form-item label="订单状态" class="mb-0">
                <el-select
                  v-model="form.type"
                  placeholder="要搜索的订单状态"
                  size="mini"
                >
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="下单时间" class="mb-0">
                <el-date-picker
                  v-model="form.time"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  size="mini"
                >
                </el-date-picker>
              </el-form-item>

              <el-form-item label="收货人" class="mb-0">
                <el-input
                  v-model="form.username"
                  size="mini"
                  placeholder="要搜索的收货人"
                ></el-input>
              </el-form-item>
              <el-form-item label="手机号" class="mb-0">
                <el-input
                  v-model="form.phone"
                  size="mini"
                  placeholder="要搜索的手机号"
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
          <el-table-column prop="title" width="350" label="商品">
            <template slot-scope="scope">
              <div class="d-flex">
                <div style="flex: 1;">
                  <p class="mb-1">订单编号:</p>
                  <p><small>21611251515251</small></p>
                </div>
                <div style="flex: 1;">
                  <p class="mb-1">下单时间</p>
                  <p><small>2020-07-21 15:49:10</small></p>
                </div>
              </div>
              <div class="media">
                <img
                  class="mr-3"
                  :src="scope.row.cover"
                  style="width: 60px;height: 60px;"
                />
                <div class="media-body">
                  <h5 class="mt-0">
                    <a href="" class="text-primary">{{ scope.row.title }}</a>
                  </h5>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="120" align="center" label="实付款">
            <template>
              <span>￥20</span>
              <p><small>(含运费:￥0.00)</small></p>
            </template>
          </el-table-column>
          <el-table-column width="120" align="center" label="买家">
            <template>
              <span>用户名</span>
              <p><small>(用户ID:1)</small></p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="支付方式">
            <template slot-scope="scope">
              <span class="badge badge-success">微信支付</span>
            </template>
          </el-table-column>
          <el-table-column prop="stock" align="center" label="配送方式">
          </el-table-column>
          <el-table-column align="center" width="180" label="交易状态">
            <template slot-scope="scope">
              <div>
                付款状态: <span class="badge badge-success">已付款</span>
              </div>
              <div>
                发货状态: <span class="badge badge-success">待发货</span>
              </div>
              <div>
                收货状态: <span class="badge badge-success">待收货</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="sale_count" align="center" label="订单详情">
          </el-table-column>
          <el-table-column align="center" width="150" label="操作">
            <template slot-scope="scope">
              <el-button type="success" size="mini" plain>订单详情</el-button>
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
        { name: "全部" },
        { name: "待付款" },
        { name: "代发货" },
        { name: "已发货" },
        { name: "已收货" },
        { name: "已完成" },
        { name: "已关闭" },
        { name: "退款中" }
      ],
      form: {
        code: "",
        type: "",
        time: "",
        username: "",
        phone: ""
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
        code: "",
        type: "",
        time: "",
        username: "",
        phone: ""
      };
      this.$refs.buttonSearch[this.tabIndex].closeSuperSearch(); //触发子组件方法
    }
  }
};
</script>

<style></style>
