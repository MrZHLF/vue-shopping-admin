<template>
  <div
    class="bg-white px-3"
    style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;"
  >
    <el-tabs v-model="activeName">
      <el-tab-pane label="支付设置" name="second">
        <el-table border class="mt-3" :data="tableData" style="width: 100%">
          <el-table-column align="left" label="支付方式">
            <template slot-scope="scope">
              <div class="d-flex align-items-center">
                <img
                  :src="scope.row.src"
                  style="width: 40px;height: 40px;"
                  class="rounded mr-2"
                />
                <div
                  class="d-flex flex-column"
                  style="align-items: flex-start;"
                >
                  <h6>{{ scope.row.name }}</h6>
                  <small class="d-block text-secondary">{{
                    scope.row.desc
                  }}</small>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="open(scope.row.key)"
                >配置</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="购物设置" name="third">
        <el-form ref="form" :model="form" label-width="160px">
          <el-form-item label="未支付订单">
            <el-input
              type="number"
              size="mini"
              style="width: 25%;"
              placeholder="未支付订单"
              v-model="form.close_order_minute"
            >
              <template slot="append">天后自动关闭</template>
            </el-input>
            <small class="text-secondary d-block"
              >订单下单未付款，n天后自动关闭，设置0天不自动关闭</small
            >
          </el-form-item>
          <el-form-item label="已发货订单">
            <el-input
              type="number"
              size="mini"
              style="width: 25%;"
              placeholder="已发货订单"
              v-model="form.auto_received_day"
            >
              <template slot="append">天后自动确认收货</template>
            </el-input>
            <small class="text-secondary d-block"
              >如果在期间未确认收货，系统自动完成收货，设置0天不自动收货</small
            >
          </el-form-item>
          <el-form-item label="已完成订单">
            <el-input
              type="number"
              size="mini"
              style="width: 25%;"
              placeholder="已完成订单"
              v-model="form.after_sale_day"
            >
              <template slot="append">天内允许申请售后</template>
            </el-input>
            <small class="text-secondary d-block"
              >订单完成后
              ，用户在n天内可以发起售后申请，设置0天不允许申请售后</small
            >
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="mini" @click="submit"
              >保存</el-button
            >
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <el-drawer title="配置" :visible.sync="drawer" direction="rtl" size="40%">
      <div style="position: absolute;top: 52px;left: 0;right: 0;bottom: 0;">
        <div
          style="position: absolute;top: 0;left: 0;right: 0;bottom: 60px;overflow-y: auto;"
        >
          <el-form ref="form" label-width="80px" v-if="drawerType === 'alipay'">
            <el-form-item label="app_id" prop="app_id">
              <el-input
                v-model="form.alipay.app_id"
                placeholder="app_id"
                size="mini"
                style="width: 90%;"
              ></el-input>
            </el-form-item>
            <el-form-item label="公钥" prop="ali_public_key">
              <el-input
                type="textarea"
                v-model="form.alipay.ali_public_key"
                placeholder="公钥"
                size="mini"
                style="width: 90%;"
              ></el-input>
            </el-form-item>
            <el-form-item label="私钥" prop="private_key">
              <el-input
                type="textarea"
                v-model="form.alipay.private_key"
                placeholder="私钥"
                size="mini"
                style="width: 90%;"
              ></el-input>
            </el-form-item>
          </el-form>

          <el-form
            ref="form"
            label-width="100px"
            :model="form"
            v-if="drawerType === 'wxpay'"
          >
            <el-form-item label="公众号 APPID" prop="app_id">
              <el-input
                v-model="form.wxpay.app_id"
                placeholder="公众号 APPID"
                size="mini"
                style="width: 50%;"
              ></el-input>
            </el-form-item>
            <el-form-item label="小程序 APPID" prop="app_id">
              <el-input
                v-model="form.wxpay.miniapp_id"
                placeholder="小程序 APPID"
                size="mini"
                style="width: 50%;"
              ></el-input>
            </el-form-item>
            <el-form-item label="appid" prop="app_id">
              <el-input
                v-model="form.wxpay.appid"
                placeholder="appid"
                size="mini"
                style="width: 50%;"
              ></el-input>
            </el-form-item>
            <el-form-item label="商户号" prop="app_id">
              <el-input
                v-model="form.wxpay.mch_id"
                placeholder="商户号"
                size="mini"
                style="width: 50%;"
              ></el-input>
            </el-form-item>
            <el-form-item label="API 密钥" prop="app_id">
              <el-input
                v-model="form.wxpay.key"
                placeholder="API 密钥"
                size="mini"
                style="width: 50%;"
              ></el-input>
            </el-form-item>
            <el-form-item label="cert_client">
              <el-upload
                action="/admin/sysconfig/upload"
                :limit="1"
                :headers="{ token: $store.state.user.token }"
                :on-success="uploadClientSuccess"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  <div class="text-danger">
                    {{
                      form.wxpay.cert_client
                        ? form.wxpay.cert_client
                        : "还未配置"
                    }}
                  </div>
                  <div class="text-muted small">例如：apiclient_cert.pem</div>
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item label="cert_key">
              <el-upload
                action="/admin/sysconfig/upload"
                :limit="1"
                :headers="{ token: $store.state.user.token }"
                :on-success="uploadKeySuccess"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  <div class="text-danger">
                    {{ form.wxpay.cert_key ? form.wxpay.cert_key : "还未配置" }}
                  </div>
                  <div class="text-muted small">apiclient_key.pem</div>
                </div>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <div
          class="border d-flex align-items-center px-3 bg-white"
          style="position: absolute;height: 60px;bottom: 0;right: 0;right: 0;left: 0;"
        >
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="submit">确认</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  inject: ["layout"],
  data() {
    return {
      drawer: false,
      drawerType: "alipay",
      activeName: "second",
      tableData: [
        {
          name: "支付宝支付",
          key: "alipay",
          desc: "该系统支持即时到账接口",
          src: "http://wxcs.niuteam.cn/addons/NsAlipay/ico.png"
        },
        {
          name: "微信支付",
          key: "wxpay",
          desc: "该系统支持微信网页支付和扫码支付",
          src: "http://wxcs.niuteam.cn/addons/NsWeixinpay/ico.png"
        }
      ],
      form: {
        close_order_minute: 0,
        auto_received_day: 0,
        after_sale_day: 0,
        alipay: {
          app_id: "",
          ali_public_key: "",
          private_key: ""
        },
        wxpay: {
          app_id: "", // 公众号 APPID
          miniapp_id: "", // 小程序 APPID
          secret: "", // 小程序secret
          appid: "", // appid
          mch_id: "", // 商户号
          key: "", // API 密钥
          cert_client: "",
          cert_key: ""
        }
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.layout.showLoading();
      this.axios
        .get("/admin/sysconfig", { token: true })
        .then(res => {
          let data = res.data.data;
          this.form = data;
          this.layout.hideLoading();
        })
        .catch(err => {
          this.layout.hideLoading();
        });
    },
    submit() {
      this.drawer = false;
      this.layout.showLoading();
      this.axios
        .post("/admin/sysconfig", this.form, { token: true })
        .then(res => {
          this.layout.hideLoading();
          this.getData();
          this.$message({
            message: "修改成功",
            type: "success"
          });
        })
        .catch(err => {
          this.layout.hideLoading();
        });
    },
    open(type) {
      this.drawerType = type;
      this.drawer = true;
    },
    uploadClientSuccess(response, file, fileList) {
      this.form.wxpay.cert_client = response.data;
    },
    uploadKeySuccess(response, file, fileList) {
      this.form.wxpay.cert_key = response.data;
    }
  }
};
</script>

<style></style>
