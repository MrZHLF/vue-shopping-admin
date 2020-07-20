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
        prop="value"
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

    <el-dialog title="添加规格" :visible.sync="createModel" top="5vh">
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
        <el-form-item label="规格值" prop="value">
          <el-input
            v-model="form.value"
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
  components: {
    buttonSearch
  },
  data() {
    return {
      tableData: [
        {
          id: 1,
          name: "颜色",
          value: "红色",
          order: 50,
          type: 0,
          status: 1
        },
        {
          id: 2,
          name: "文字",
          value: "小说",
          order: 10,
          type: 0,
          status: 1
        },
        {
          id: 3,
          name: "颜色",
          value: "蓝色",
          order: 500,
          type: 0,
          status: 1
        },
        {
          id: 4,
          name: "文字",
          value: "电影",
          order: 50,
          type: 0,
          status: 1
        }
      ],
      multipleSelection: [], //多选
      currentPage: 1,
      createModel: false,
      editIndex: -1, //是否编辑或者修改
      form: {
        name: "",
        order: 50,
        status: 1,
        type: 0,
        value: ""
      },
      rules: {
        name: [
          { required: true, message: "规格名称不能为空", trigger: "blur" }
        ],
        value: [{ required: true, message: "规格值不能为空", trigger: "blur" }]
      }
    };
  },
  created() {
    this.__getData();
  },
  methods: {
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
    openModel(e = false) {
      if (!e) {
        // 增加
        this.form = {
          name: "",
          order: 50,
          status: 1,
          type: 0,
          value: ""
        };
        this.editIndex = -1;
      } else {
        // 编辑
        this.form = {
          name: e.row.name,
          order: e.row.order,
          status: e.row.status,
          type: e.row.type,
          value: e.row.value.replace(",", "\n")
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
          var msg = "添加";
          this.form.value = this.form.value.replace(/\n/g, ",");
          if (this.editIndex === -1) {
            // 添加
            this.tableData.unshift(this.form);
          } else {
            // 编辑
            let item = this.tableData[this.editIndex];
            item.name = this.form.name;
            item.order = this.form.order;
            item.status = this.form.status;
            item.type = this.form.type;
            item.value = this.form.value.replace(/\n/g, ",");
            msg = "修改";
          }
          this.createModel = false;
          this.$message({
            message: msg + "成功",
            type: "success"
          });
        }
      });
    },
    __getData() {},
    changeStatus(item) {
      // 修改状态
      item.status = !item.status;
      this.$message({
        message: item.status ? "启用成功" : "禁用",
        type: "success"
      });
    },
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

<style></style>
-->
