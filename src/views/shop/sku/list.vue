<template>
  <div
    class="bg-white px-3"
    style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;"
  >
    <button-search class="pt-3" :showSearch="false">
      <template #left>
        <!-- 左边 -->
        <el-button size="mini" type="success" @click="openModel(false)"
          >添加规格</el-button
        >
        <el-button size="mini" type="danger" @click="deleteAll"
          >批量删除</el-button
        >
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
      <el-table-column prop="name" width="380" label="规格名称">
      </el-table-column>
      <el-table-column
        prop="default"
        align="center"
        width="380"
        label="规格值"
      ></el-table-column>
      <el-table-column
        prop="order"
        align="center"
        label="商品排序"
      ></el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-button
            :type="scope.row.status ? 'success' : 'danger'"
            plain
            @click="changeStatus(scope.row)"
            >{{ scope.row.status ? "启用" : "禁用" }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              type="success"
              size="mini"
              plain
              @click="openModel(scope)"
              >修改</el-button
            >
            <el-button
              type="danger"
              size="mini"
              plain
              @click="deleteItem(scope.row)"
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

    <el-dialog
      :title="editIndex > -1 ? '修改规格' : '添加规格'"
      :visible.sync="createModel"
      top="5vh"
    >
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="规格名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入规格名称"
            size="mini"
            style="width: 30%;"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number
            v-model="form.order"
            :min="0"
            size="mini"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status" size="mini">
            <el-radio :label="1" border>启用</el-radio>
            <el-radio :label="0" border>禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="form.type" size="mini">
            <el-radio :label="0" border>文字</el-radio>
            <el-radio :label="1" border>颜色</el-radio>
            <el-radio :label="2" border>图片</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="规格值" prop="default">
          <el-input
            v-model="form.default"
            type="textarea"
            :rows="2"
            placeholder="一行为一个规格项,多个规格项用换行输入"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createModel = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import buttonSearch from "@/components/common/button-search.vue";
export default {
  name: "list",
  inject: ["layout"],
  components: {
    buttonSearch
  },
  data() {
    return {
      page: {
        current: 1,
        sizes: [10, 20, 50, 100],
        size: 10,
        total: 0
      },
      tableData: [],
      multipleSelection: [], //多选
      createModel: false,
      editIndex: -1, //是否编辑或者修改
      form: {
        name: "",
        order: 50,
        status: 1,
        type: 0,
        default: ""
      },
      rules: {
        name: [
          { required: true, message: "规格名称不能为空", trigger: "blur" }
        ],
        default: [
          { required: true, message: "规格值不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  computed: {
    ids() {
      return this.multipleSelection.map(item => {
        return item.id;
      });
    }
  },
  methods: {
    getList() {
      this.layout.showLoading();
      let url = `/admin/skus/${this.page.current}?limit=${this.page.size}`;
      this.axios
        .get(url, {
          token: true
        })
        .then(res => {
          let data = res.data.data;
          this.tableData = data.list;
          this.page.total = data.totalCount;
          this.layout.hideLoading();
        })
        .catch(err => {
          this.layout.hideLoading();
        });
    },
    deleteAll() {
      // 批量删除
      if (this.ids.length === 0) {
        return this.$message({
          message: "选择要删除的信息",
          type: "error"
        });
      }
      this.$confirm("此操作将永久删除选中规格, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.layout.showLoading();
        this.axios
          .post(
            "/admin/skus/delete_all",
            {
              ids: this.ids
            },
            { token: true }
          )
          .then(res => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getList();
            this.layout.hideLoading();
            this.multipleSelection = [];
          })
          .catch(err => {
            this.layout.hideLoading();
          });
      });
    },
    openModel(e = false) {
      if (!e) {
        // 增加
        this.form = {
          name: "",
          order: 50,
          status: 1,
          type: 0,
          default: ""
        };
        this.editIndex = -1;
      } else {
        // 编辑
        this.form = {
          name: e.row.name,
          order: e.row.order,
          status: e.row.status,
          type: e.row.type,
          default: e.row.default.replace(",", "\n")
        };
        this.editIndex = e.$index;
      }

      this.createModel = true;
    },
    submit() {
      // 添加规格
      this.$refs.ruleForm.validate(res => {
        //提交表单
        if (res) {
          this.form.default = this.form.default.replace(/\n/g, ",");
          if (this.editIndex === -1) {
            // 添加
            this.layout.showLoading();
            this.axios
              .post("/admin/skus", this.form, {
                token: true
              })
              .then(res => {
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                this.getList();
                this.layout.hideLoading();
              })
              .catch(err => {
                this.layout.hideLoading();
              });
          } else {
            // 编辑
            let item = this.tableData[this.editIndex];
            this.layout.showLoading();
            this.axios
              .post("/admin/skus/" + item.id, this.form, {
                token: true
              })
              .then(res => {
                this.$message({
                  message: "编辑成功",
                  type: "success"
                });
                this.getList();
                this.layout.hideLoading();
              })
              .catch(err => {
                this.layout.hideLoading();
              });
          }
          this.createModel = false;
        }
      });
    },
    changeStatus(item) {
      // 修改状态
      this.layout.showLoading();
      let status = item.status === 1 ? 0 : 1;
      let msg = item.status === 1 ? "启用" : "禁用";
      this.axios
        .post(
          `/admin/skus/${item.id}/update_status`,
          {
            status: status
          },
          { token: true }
        )
        .then(res => {
          item.status = status;
          this.$message({
            message: msg + "成功",
            type: "success"
          });
          this.layout.hideLoading();
        })
        .catch(err => {
          this.layout.hideLoading();
        });
      item.status = !item.status;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteItem(item) {
      console.log(item);
      // 删除商品规格
      this.$confirm("此操作将永久删除该规格, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.layout.showLoading();
        this.axios
          .post("/admin/skus/" + item.id + "/delete", {}, { token: true })
          .then(res => {
            this.getList();
            this.layout.hideLoading();
            this.$message({
              message: "删除成功",
              type: "success"
            });
          })
          .catch(err => {
            this.layout.hideLoading();
          });
      });
    },
    handleSizeChange(val) {
      this.page.size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.getList();
    }
  }
};
</script>

<style></style>
-->
