<template>
  <div
    class="bg-white px-3"
    style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;"
  >
    <button-search
      class="pt-3"
      ref="buttonSearch"
      placeholder="要搜索的商品名称"
      @search="searchEvent"
      :showSuperSearch="false"
    >
    </button-search>

    <el-table :data="tableData" border class="mt-3" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <div class="media">
            <img
              :src="scope.row.user.avatar"
              class="mr-3"
              style="width: 80px;height: 80px;border-radius: 50%;"
            />
            <div class="media-body">
              <h5 class="mt-0 d-flex">
                {{ scope.row.user.username }}
                <small>{{ scope.row.review_time }}</small>
                <el-button
                  v-if="!scope.row.extra"
                  type="infor"
                  class="ml-auto"
                  size="mini"
                  @click="textareaEdit = true"
                  >回复</el-button
                >
              </h5>
              {{ scope.row.review.data }}

              <div class="py-2">
                <img
                  v-for="(item, index) in scope.row.review.image"
                  :key="index"
                  :src="item"
                  class="mr-3"
                  style="width: 80px;height: 80px;border-radius: 50%;"
                />
              </div>

              <div v-if="textareaEdit">
                <el-input
                  v-model="textarea"
                  :rows="2"
                  type="textarea"
                  placeholder="请输入评价内容"
                ></el-input>
                <div class="py-2">
                  <el-button
                    type="success"
                    size="mini"
                    class="mr-2"
                    @click="review(scope.row.id)"
                    >回复</el-button
                  >
                  <el-button type="infor" @click="closeTextarea" size="mini"
                    >取消</el-button
                  >
                </div>
              </div>

              <div v-if="scope.row.extra && !textareaEdit">
                <div
                  class="media mt-3 bg-light p-2 rounded"
                  v-for="(item, index) in scope.row.extra"
                  :key="index"
                >
                  <div class="media-body">
                    <h5 class="mt-0 d-flex">
                      客服:
                      <el-button
                        v-if="!textareaEdit"
                        type="infor"
                        class="ml-auto"
                        size="mini"
                        @click="openTextarea(item.data)"
                        >修改</el-button
                      >
                    </h5>
                    {{ item.data }}
                  </div>
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
              :src="scope.row.goods_item.cover"
              style="width: 60px;height: 60px;"
            />
            <div class="media-body ml-0">
              <h5 class="mt-0">{{ scope.row.goods_item.title }}</h5>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="200" label="评价信息">
        <template slot-scope="scope">
          <div class="d-flex flex-column">
            <p class="d-flex">用户名:{{ scope.row.user.username }}</p>
            <p class="d-flex">
              评分:
              <el-rate
                v-model="scope.row.rating"
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
        prop="review_time"
        label="评价时间"
      ></el-table-column>
      <el-table-column align="center" width="150" label="是否显示">
        <template slot-scope="scope">
          <el-button
            :type="scope.row.status ? 'success' : 'danger'"
            size="mini"
            @click="changeStatus(scope.row)"
            plain
            >{{ scope.row.status ? "启用" : "禁用" }}
          </el-button>
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
        >
        </el-pagination>
      </div>
    </el-footer>
  </div>
</template>
<script>
import buttonSearch from "@/components/common/button-search.vue";
import common from "@/common/mixins/common.js";
export default {
  inject: ["layout"],
  mixins: [common],
  name: "list",
  components: {
    buttonSearch
  },
  data() {
    return {
      textarea: "",
      textareaEdit: false,
      preUrl: "goods_comment",
      tableData: [],
      title: ""
    };
  },
  methods: {
    openTextarea(data) {
      this.textarea = data;
      this.textareaEdit = true;
    },
    review(id) {
      // 回复
      if (this.textarea === "") {
        return this.$message({
          message: "回复内容不能为空",
          type: "error"
        });
      }
      this.layout.showLoading();

      this.axios
        .post(
          "/admin/goods_comment/review/" + id,
          {
            data: this.textarea
          },
          {
            token: true
          }
        )
        .then(res => {
          this.closeTextarea();
          this.$message({
            message: "回复成功",
            type: "success"
          });
          this.getList();
          this.layout.hideLoading();
        })
        .catch(err => {
          this.layout.hideLoading();
        });
    },
    closeTextarea() {
      this.textarea = "";
      this.textareaEdit = false;
    },
    getListResult(e) {
      console.log(e.list);
      this.tableData = e.list;
    },
    getListUrl() {
      //处理url以及参数
      return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}&title=${this.title}`;
    },
    searchEvent(e) {
      // 搜索
      this.title = e;
      this.getList();
    }
  }
};
</script>

<style></style>
