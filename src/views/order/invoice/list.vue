<template>
  <div
    class="bg-white px-3"
    style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;"
  >
    <button-search class="pt-3">
      <template #right>
        <div class="d-flex align-items-center">
          <el-date-picker
            v-model="search.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="medium"
          >
          </el-date-picker>
          <el-input
            v-model="search.keyword"
            size="medium"
            placeholder="请输入订单号"
            width="200"
            class="mx-2"
          ></el-input>
          <el-button type="infor" size="medium">搜索</el-button>
        </div>
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
      <el-table-column prop="name" label="订单编号"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="price" label="开票金额"></el-table-column>
      <el-table-column prop="name" label="抬头"></el-table-column>
      <el-table-column prop="content" label="发票内容"></el-table-column>
      <el-table-column prop="code" label="纳税人识别号"></el-table-column>
      <el-table-column prop="create_time" label="创建时间"></el-table-column>
      <el-table-column align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              type="danger"
              size="mini"
              plain
              @click="deleteItem(scope)"
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
          :current-page="currentPage"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400"
        ></el-pagination>
      </div>
    </el-footer>
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
      tableData: [],
      multipleSelection: [], //多选
      currentPage: 1,
      search: {
        time: "",
        keyword: ""
      }
    };
  },
  created() {},
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteItem(scope) {
      // 删除商品规格
      console.log(scope);
      this.$confirm("此操作将永久删除该规格, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.tableData.splice(scope.$index, 1);
      });
    }
  }
};
</script>

<style>
.sku-list-item > i {
  display: none;
  cursor: pointer;
}
.sku-list-item:hover {
  background-color: #f4f4f4;
}
.sku-list-item:hover > font {
  display: none;
}
.sku-list-item:hover > i {
  display: inline-block;
}
</style>
