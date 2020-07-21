<template>
  <div
    class="bg-white px-3"
    style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;"
  >
    <button-search
      class="pt-3"
      ref="buttonSearch"
      placeholder="要搜索的商品名称"
      @serach="searchEvent"
    >
      <template #left>
        <!-- 左边 -->
        <el-button size="mini" type="danger" @click="deleteAll"
          >批量删除</el-button
        >
      </template>
      <template #form>
        <!-- 高级表单 -->
        <el-form inline ref="form" :model="form" label-width="80px">
          <el-form-item label="评价用户" class="mb-0"
            ><el-input
              v-model="form.username"
              size="mini"
              placeholder="评价用户"
            ></el-input
          ></el-form-item>
          <el-form-item label="评价类型" class="mb-0">
            <el-select
              v-model="form.type"
              placeholder="要搜索的评价类型"
              size="mini"
            >
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布时间" class="mb-0">
            <el-date-picker
              size="mini"
              v-model="form.time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
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
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <div class="media">
            <img
              src="../../../assets/logo.png"
              class="mr-3"
              style="width: 80px;height: 80px;border-radius: 50%;"
            />
            <div class="media-body">
              <h5 class="mt-0 d-flex">
                用户名 <small>2020-07-20 17:51:00</small>
                <el-button type="danger" class="ml-auto" size="mini"
                  >删除</el-button
                >
              </h5>
              评价内容

              <div class="media mt-3">
                <a class="mr-3" href="#">
                  <img
                    src="../../../assets/logo.png"
                    class="mr-3"
                    style="width: 80px;height: 80px;border-radius: 50%;"
                  />
                </a>
                <div class="media-body">
                  <h5 class="mt-0 d-flex">
                    客服一
                    <small>2020-07-20 17:51:00</small>
                    <el-button type="danger" class="ml-auto" size="mini"
                      >删除</el-button
                    >
                  </h5>
                  回复内容
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="id"
        label="ID"
        align="center"
        width="80"
      ></el-table-column>
      <el-table-column prop="value" align="center" width="380" label="商品">
        <template slot-scope="scope">
          <div class="media">
            <img
              :src="scope.row.goods.cover"
              style="width: 60px;height: 60px;"
            />
            <div class="media-body ml-0">
              <h5 class="mt-0">{{ scope.row.goods.title }}</h5>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="200" label="评价信息">
        <template slot-scope="scope">
          <div class="d-flex flex-column">
            <p class="d-flex">用户名:{{ scope.row.username }}</p>
            <p class="d-flex">
              评分:
              <el-rate
                v-model="scope.row.star"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}"
              ></el-rate>
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="create_time"
        label="评价时间"
      ></el-table-column>
      <el-table-column align="center" width="150" label="是否显示">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status"></el-switch>
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
      form: {
        username: "",
        type: "",
        time: ""
      },
      tableData: [
        {
          id: 1,
          goods: {
            title: "商品标题",
            cover: "http://static.yoshop.xany6.com/2018071718294208f086786.jpg"
          },
          username: "用户名",
          star: 5,
          create_time: "2020-07-20 17:32:00",
          status: 1
        }
      ],
      multipleSelection: [], //多选
      currentPage: 1
    };
  },
  created() {},
  methods: {
    searchEvent() {},
    clearSearch() {},
    deleteAll() {
      // 批量删除
      this.$confirm("此操作将永久删除选中规格, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.multipleSelection.forEach(item => {
          let index = this.tableData.findIndex(v => v.id === item.id);
          if (index !== -1) {
            this.tableData.splice(index, 1);
          }
        });
        this.multipleSelection = [];
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>

<style></style>
-->
