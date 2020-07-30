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
      </el-tab-pane>
    </el-tabs>
    <button-search
      ref="buttonSearch"
      placeholder="要搜索的订单编号"
      @search="searchEvent"
    >
      <template #left>
        <!-- 左边 -->
        <el-button type="success" size="mini">导出数据</el-button>
        <el-button type="danger" size="mini" @click="deleteAll"
          >批量删除</el-button
        >
      </template>
      <template #form>
        <!-- 表单 -->
        <el-form inline ref="form" :model="form" label-width="80px">
          <el-form-item label="订单编号" class="mb-0">
            <el-input
              v-model="form.no"
              size="mini"
              placeholder="要搜索的订单编号"
            ></el-input>
          </el-form-item>
          <el-form-item label="下单时间" class="mb-0">
            <el-date-picker
              v-model="form.time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="收货人" class="mb-0">
            <el-input
              v-model="form.name"
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
      <el-table-column type="selection" width="45" align="center">
      </el-table-column>
      <el-table-column prop="title" width="350" label="商品">
        <template slot-scope="scope">
          <div class="d-flex">
            <div style="flex: 1;">
              <p class="mb-1">订单编号:</p>
              <p>
                <small>{{ scope.row.no }}</small>
              </p>
            </div>
            <div style="flex: 1;">
              <p class="mb-1">下单时间</p>
              <p>
                <small>{{ scope.row.create_time }}</small>
              </p>
            </div>
          </div>
          <div
            class="media"
            v-for="(item, index) in scope.row.order_items"
            :key="index"
          >
            <img
              class="mr-3 border-top py-2"
              :src="item.goods_item.cover"
              style="width: 60px;height: 60px;"
            />
            <div class="media-body">
              <h5 class="mt-0">
                <a href="" class="text-primary">{{ item.goods_item.title }}</a>
              </h5>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="实付款">
        <template slot-scope="scope">
          <span>￥{{ scope.row.total_price }}</span>
          <p><small>(含运费:￥0.00)</small></p>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="买家">
        <template slot-scope="scope">
          <span>{{ scope.row.user.username }}</span>
          <p>
            <small>(用户ID:{{ scope.row.user.id }})</small>
          </p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付方式">
        <template slot-scope="scope">
          <span
            class="badge badge-success"
            v-if="scope.row.payment_method === 'wechat'"
            >微信支付</span
          >
          <span
            class="badge badge-primary"
            v-else-if="scope.row.payment_method === 'alipay'"
            >支付寶支付</span
          >
          <span class="badge badge-secondary" v-else>未支付</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="配送方式">
        <template slot-scope="scope">
          <div v-if="scope.row.ship_data">
            <div>{{ scope.row.ship_data.express_company }}</div>
            <div>{{ scope.row.ship_data.express_no }}</div>
          </div>
          <span class="badge badge-secondary" v-else>未配送</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="180" label="交易状态">
        <template slot-scope="scope">
          <div>
            付款状态:
            <span
              class="badge"
              :class="
                scope.row.payment_method ? 'badge-success' : 'badge-secondary'
              "
            >
              {{ scope.row.payment_method ? "已付款" : "未付款" }}</span
            >
          </div>
          <div>
            发货状态:
            <span
              class="badge"
              :class="scope.row.ship_data ? 'badge-success' : 'badge-secondary'"
            >
              {{ scope.row.ship_data ? "已发货" : "未发货" }}</span
            >
          </div>
          <div>
            收货状态:
            <span
              class="badge"
              :class="
                scope.row.ship_status === 'pending'
                  ? 'badge-success'
                  : 'badge-secondary'
              "
            >
              {{
                scope.row.ship_status === "pending" ? "已收货" : "未收货"
              }}</span
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini">订单详情</el-button>
          <el-button
            type="text"
            size="mini"
            @click="ship(scope.row)"
            v-if="
              scope.row.ship_status === 'pending' &&
                scope.row.closed === 0 &&
                scope.row.payment_method &&
                scope.row.refund_status === 'pending'
            "
            >订单发货</el-button
          >
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
    <el-dialog title="订单发货" :visible.sync="shipModel">
      <el-form ref="ruleForm" :model="shipForm" label-width="80px">
        <el-form-item label="快递公司" prop="express_company">
          <el-select v-model="shipForm.express_company" placeholder="请选择">
            <el-option
              v-for="(item, index) in express_company_options"
              :key="index"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" prop="express_no">
          <el-input type="text" v-model="shipForm.express_no"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="shipModel = false">取 消</el-button>
        <el-button type="primary" @click="shipSubmit">确 定</el-button>
      </div>
    </el-dialog>
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
      shipModel: false,
      preUrl: "order",
      tabIndex: 0,
      tabbars: [
        { name: "全部", key: "all" },
        { name: "待付款", key: "nopay" },
        { name: "代发货", key: "noship" },
        { name: "已发货", key: "shiped" },
        { name: "已收货", key: "received" },
        { name: "已完成", key: "finish" },
        { name: "已关闭", key: "closed" },
        { name: "退款中", key: "refunding" }
      ],
      form: {
        no: "",
        time: "",
        name: "",
        phone: ""
      },
      shipForm: {
        express_company: "", //快递公司
        express_no: "" //快递单号
      },
      shipId: 0,
      express_company_options: [],
      tableData: []
    };
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
          if (Array.isArray(val)) {
            str += `&starttime=${val[0]}`;
            str += `&endtime=${val[1]}`;
          } else {
            str += `&${key}=${this.form[key]}`;
          }
        }
      }
      return str;
    }
  },
  created() {
    this.axios
      .get("/admin/express_company/1?limit=50", {
        token: true
      })
      .then(res => {
        let data = res.data.data;
        this.express_company_options = data.list;
      });
  },
  methods: {
    ship(item) {
      // 订单发货
      this.shipId = item.id;
      this.shipModel = true;
    },
    shipSubmit() {
      // 发货
      this.layout.showLoading();
      console.log(this.shipForm.express_companya);
      this.axios
        .post("/admin/order/" + this.shipId + "/ship", this.shipForm, {
          token: true
        })
        .then(res => {
          this.$message({
            message: "发货成功",
            type: "success"
          });
          this.shipModel = false;

          this.getList();
          this.layout.hideLoading();
        })
        .catch(err => {
          this.layout.hideLoading();
        });
    },
    getListUrl() {
      //处理url以及参数
      return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}&tab=${this.tab}${this.params}`;
    },
    getListResult(e) {
      // 从mixins接受的数据
      this.tableData = e.list;
      console.log(e);
    },
    handleClick() {
      //tab切换
      this.getList();
    },
    searchEvent(e = false) {
      // 搜索
      if (typeof e === "string") {
        this.form.no = e;
        this.getList();
        return;
      }
      // 高级搜索
      this.getList();
    },
    clearSearch() {
      // 清空筛选条件
      this.form = {
        no: "",
        time: "",
        name: "",
        phone: ""
      };
    }
  }
};
</script>

<style></style>
