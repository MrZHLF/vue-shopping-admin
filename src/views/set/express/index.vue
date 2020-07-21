<template>
  <div
    class="bg-white px-3"
    style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;"
  >
    <el-tabs v-model="activeName">
      <div>
        <el-button type="primary" size="mini">添加模板</el-button>
      </div>
      <el-tab-pane label="运费模板" name="second">
        <el-table border class="mt-3" :data="tableData" style="width: 100%">
          <el-table-column align="center" label="模板名称" prop="name">
          </el-table-column>
          <el-table-column align="center" width="250" label="计费方式">
            <template slot-scope="scope">
              {{ scope.row.type | formatType }}
            </template>
          </el-table-column>
          <el-table-column prop="order" align="center" label="排序">
          </el-table-column>
          <el-table-column prop="create_time" align="center" label="添加时间">
          </el-table-column>
          <el-table-column prop="status" align="center" label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="text" size="mini">修改</el-button>
              <el-button type="text" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="物流跟踪" name="third">
        <el-form ref="form" :model="form" label-width="160px">
          <el-form-item label="快递100 Customer">
            <el-input
              v-model="form.customer"
              size="mini"
              style="width: 50%;"
              placeholder="快递100 Customer"
            ></el-input>
            <small class="text-secondary d-block"
              >用于查询物流信息，<a href="#">快递100申请</a></small
            >
          </el-form-item>
          <el-form-item label="快递100 Key">
            <el-input
              v-model="form.key"
              size="mini"
              style="width: 50%;"
              placeholder="快递100 Key"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "second",
      tableData: [
        {
          name: "全国统一邮费",
          type: 0,
          create_time: "2019-07-17 16:29:32",
          status: 1,
          order: 100
        },
        {
          name: "全国统一邮费",
          type: 1,
          create_time: "2020-07-17 10:19:02",
          status: 0,
          order: 10
        }
      ],
      form: {
        customer: "",
        key: ""
      }
    };
  },
  filters: {
    formatType(value) {
      console.log(value, "56");
      let arr = ["按重量", "按件数"];
      return arr[value];
    }
  }
};
</script>

<style></style>
