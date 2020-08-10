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
      <el-form ref="form" label-width="80px">
        <el-form-item label="市场价格">
          <el-input type="number" v-model="sku_value.oprice" class="w-25">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="销售价格">
          <el-input type="number" v-model="sku_value.pprice" class="w-25">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="成本价格">
          <el-input type="number" v-model="sku_value.cprice" class="w-25">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input type="number" v-model="sku_value.weight" class="w-25">
            <template slot="append">公斤</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品体积">
          <el-input type="number" v-model="sku_value.volume" class="w-25">
            <template slot="append">立方平</template>
          </el-input>
        </el-form-item>
      </el-form>
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
          <el-button type="success" size="mini" @click="addSkuCardEvent"
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
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import singleAttrs from "@/components/shop/create/single-attrs.vue";
import skuCard from "@/components/shop/create/sku/sku-card.vue";
import skuTable from "@/components/shop/create/sku-table.vue";
export default {
  inject: ["app", "layout"],
  components: {
    singleAttrs,
    skuCard,
    skuTable
  },
  data() {
    return {
      id: 0,
      sku_value: {
        oprice: 0,
        pprice: 0,
        cprice: 0,
        weight: 0,
        volume: 0
      },
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
      sku_card: state => state.goods_create.sku_card //规格
    }),
    skuCardTotal() {
      // 是否是最后一个,规格卡片总数
      return this.sku_card.length;
    }
  },
  created() {
    this.id = this.$route.params.id;
    this.getData();
  },
  methods: {
    getData() {
      if (!this.id) {
        this.$message({
          message: "非法参数",
          type: "error"
        });
        return this.$router.push({
          name: "shop_goods_list"
        });
      }
      this.layout.showLoading();
      this.axios
        .get("/admin/goods/read/" + this.id, { token: true })
        .then(res => {
          console.log(res);
          this.layout.hideLoading();
        })
        .catch(err => {
          this.layout.hideLoading();
        });
    },
    ...mapMutations(["vModelState", "addSkuCard", "vModelGoodsattrs"]),
    addSkuCardEvent() {
      this.layout.showLoading();
      this.axios
        .post(
          "/admin/goods_skus_card",
          {
            goods_id: this.id,
            name: "规格名称",
            order: 50,
            type: 0
          },
          { token: true }
        )
        .then(res => {
          console.log(res);
          let data = res.data.data;
          data.list = [];
          this.addSkuCard(data);
          this.layout.hideLoading();
        })
        .catch(err => {
          this.layout.hideLoading();
        });
    },
    //修改表单值
    vModel(key, value) {
      this.vModelState({ key, value });
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
    }
  }
};
</script>

<style>
.goods_create .el-form-item {
  margin-bottom: 15px;
}
</style>
