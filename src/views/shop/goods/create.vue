<template>
  <div
    class="bg-white px-3 goods_create"
    style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;"
  >
    <router-link
      :to="{ name: 'shop_goods_list' }"
      style="position: absolute;top: 12px;left: 180px;"
      ><el-button size="mini">返回商品列表</el-button></router-link
    >
    <el-tabs v-model="tabIndex" @tab-click="handleClick">
      <el-tab-pane label="基础设置">
        <base-create />
      </el-tab-pane>
      <el-tab-pane label="商品规格">
        <el-form ref="form" label-width="80px">
          <el-form-item label="商品规格">
            <el-radio-group
              :value="skus_type"
              @input="vModel('skus_type', $event)"
              size="medium"
            >
              <el-radio-button :label="0">单一规格</el-radio-button>
              <el-radio-button :label="1">多规格</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <!-- 单规格 -->
        <template v-if="skus_type === 0">
          <single-attrs></single-attrs>
        </template>
        <!-- 父规格 -->
        <template v-else>
          <!-- 添加规格卡片 -->
          <el-form ref="form" label-width="80px">
            <el-form-item label="添加规格">
              <sku-card
                v-for="(item, index) in sku_card"
                :key="index"
                :item="item"
                :index="index"
                :total="skuCardTotal"
              ></sku-card>
              <el-button type="success" size="mini" @click="addSkuCard"
                >添加规格</el-button
              >
            </el-form-item>
          </el-form>

          <el-form ref="form" label-width="80px">
            <el-form-item label="批量设置">
              <template v-if="!updateAllStatus">
                <el-button
                  type="text"
                  v-for="(btn, index) in updateList"
                  :key="index"
                  @click="openUpdateAllStatus(btn)"
                  >{{ btn.name }}</el-button
                >
              </template>

              <div v-else class="d-flex align-items-center">
                <el-input
                  size="small"
                  style="width: 150px;"
                  class="mr-2"
                  type="number"
                  :placeholder="updateAllPlaceholder"
                  v-model="updateAllValue"
                ></el-input>
                <el-button size="mini" type="primary" @click="updateAllSubmit"
                  >设置</el-button
                >
                <el-button size="mini" @click="closeUpdateAllStatus"
                  >取消</el-button
                >
              </div>
            </el-form-item>
            <el-form-item label="规格设置">
              <sku-table ref="table"></sku-table>
            </el-form-item>
          </el-form>
        </template>
      </el-tab-pane>
      <el-tab-pane label="商品属性">商品属性</el-tab-pane>
      <el-tab-pane label="媒体设置">
        <el-form>
          <el-form-item label="商品大图">
            <div class="d-flex flex-wrap">
              <div
                style="width: 150px;height: 150px;cursor: pointer;position: relative;"
                class="border rounded d-flex align-items-center justify-content-center mr-3 mb-3"
                @click="chooseImage(index)"
                v-for="(item, index) in banners"
                :key="index"
              >
                <img
                  v-if="item.url"
                  :src="item.url"
                  alt=""
                  style="width: 100%;height: 100%;"
                />
                <i
                  v-else
                  class="el-icon-plus text-muted"
                  style="font-size: 30px;"
                ></i>
                <i
                  class="el-icon-delete p-2 text-white"
                  style="position: absolute;top: 0;right: 0;background: rgba(0,0,0,.4);"
                  @click.stop="deleteImage(index)"
                ></i>
              </div>
              <div
                v-if="banners.length < 9"
                style="width: 150px;height: 150px;cursor: pointer;"
                class="border rounded d-flex align-items-center justify-content-center mr-3 mb-3"
                @click="chooseImage(-1)"
              >
                <i class="el-icon-plus text-muted" style="font-size: 30px;"></i>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品详情">
        <!-- 富文本编辑器 -->
        <tinymce ref="editor" v-model="msg" @onClick="onClick"></tinymce>
      </el-tab-pane>
      <el-tab-pane label="折扣设置">折扣设置</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import baseCreate from "@/components/shop/create/base-create.vue";
import singleAttrs from "@/components/shop/create/single-attrs.vue";
import skuCard from "@/components/shop/create/sku/sku-card.vue";
import skuTable from "@/components/shop/create/sku-table.vue";
import tinymce from "@/components/common/tinymce.vue";
export default {
  inject: ["app"],
  components: {
    baseCreate,
    singleAttrs,
    skuCard,
    skuTable,
    tinymce
  },
  data() {
    return {
      tabIndex: 0,
      msg: "5151515",
      updateAllStatus: false, //批量修改
      updateAllPlaceholder: "",
      updateAllValue: "",
      updateList: [
        { name: "销售价", key: "pprice" },
        { name: "市场价", key: "oprice" },
        { name: "成本价", key: "cprice" },
        { name: "库存", key: "stock" },
        { name: "体积", key: "volume" },
        { name: "重量", key: "weight" }
      ]
    };
  },
  computed: {
    ...mapState({
      skus_type: state => state.goods_create.skus_type, //0单规格1多规格
      sku_card: state => state.goods_create.sku_card, //规格
      banners: state => state.goods_create.banners //商品大图
    }),
    skuCardTotal() {
      // 是否是最后一个,规格卡片总数
      return this.sku_card.length;
    }
  },
  mounted() {},
  methods: {
    ...mapMutations(["vModelState", "addSkuCard"]),
    //修改表单值
    vModel(key, value) {
      this.vModelState({ key, value });
    },
    handleClick(tab, event) {
      //tab切换
      console.log(tab.index);
    },
    onClick(e) {
      console.log(e);
    },
    openUpdateAllStatus(item) {
      // 修改批量设置
      this.updateAllStatus = item.key;
      this.updateAllPlaceholder = item.name;
    },
    // 取消批量设置状态
    closeUpdateAllStatus() {
      this.updateAllStatus = false;
      this.updateAllValue = "";
    },
    // 提交批量设置
    updateAllSubmit() {
      this.$refs.table.list.forEach(item => {
        item[this.updateAllStatus] = this.updateAllValue;
      });
      this.closeUpdateAllStatus();
    },
    chooseImage(index) {
      // 选择图片
      const MAX = 9;
      let count = MAX - this.banners.length;
      this.app.chooseImage(
        res => {
          let list = [];
          if (index === -1) {
            list = [...this.banners, ...res];
          } else {
            list = [...this.banners];
            list[index] = res[0];
          }

          this.vModel("banners", list);
        },
        index === -1 ? count : 1
      );
    },
    deleteImage(index) {
      // 删除大图
      this.$confirm("是否删除该图片?", "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let list = [...this.banners];
        list.splice(index, 1);
        this.vModel("banners", list);
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      });
    }
  }
};
</script>

<style>
.goods_create .el-form-item {
  margin-bottom: 15px;
}
</style>
