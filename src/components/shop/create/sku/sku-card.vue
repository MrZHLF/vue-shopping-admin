<template>
  <div class="card mb-3" style="line-height: 1.2;">
    <div class="card-header d-flex align-items-center">
      规格项:
      <el-input
        size="mini"
        style="width: 200px;"
        :value="item.name"
        @input="vModel('name', index, $event)"
      >
        <el-button
          slot="append"
          icon="el-icon-more"
          @click="chooseSkus"
        ></el-button>
      </el-input>
      <el-radio-group
        size="mini"
        style="margin-bottom: -10px;"
        :value="item.type"
        @input="vModel('type', index, $event)"
        class="ml-2"
      >
        <el-radio :label="0">无</el-radio>
        <el-radio :label="1">颜色</el-radio>
        <el-radio :label="2">图片</el-radio>
      </el-radio-group>
      <!-- 上移 -->
      <el-button
        class="ml-auto"
        size="mini"
        :disabled="index === 0"
        icon="el-icon-top"
        @click="sortCard('moveUp', index)"
      ></el-button>
      <!-- 下移 -->
      <el-button
        size="mini"
        icon="el-icon-bottom"
        :disabled="total === index + 1"
        @click="sortCard('moveDown', index)"
      ></el-button>
      <el-button size="mini" type="danger" @click="delSkuCard(index)"
        >删除</el-button
      >
    </div>
    <div class="card-body">
      <!-- 规格属性列表 -->
      <div class="d-flex align-items-center flex-wrap">
        <sku-card-children
          :type="item.type"
          v-for="(item2, index2) in list"
          :key="index2"
          :item="item2"
          :index="index2"
          :cardIndex="index"
          v-dragging="{ item: item2, list: list, group: `skuItem${index}` }"
        ></sku-card-children>
      </div>
      <div class="mt-2">
        <el-button
          type="text"
          size="mini"
          icon="el-icon-plus"
          @click="addSkuValue(index)"
        >
          增加规格值</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import skuCardChildren from "./sku-card-children.vue";
export default {
  inject: ["app"],
  components: {
    skuCardChildren
  },
  props: {
    item: Object,
    index: Number,
    total: Number
  },
  data() {
    return {
      list: this.item.list
    };
  },
  mounted() {
    // 监听list变化
    this.$watch("item.list", (newValue, oldValue) => {
      this.list = newValue;
    });

    this.$dragging.$on("dragging", e => {
      console.log(e);
      if (e.group === "skuItem" + this.index) {
        this.sortSkuValue({
          index: this.index,
          value: this.list
        });
      }
    });
  },
  methods: {
    ...mapMutations([
      "delSkuCard",
      "vModelSkuCard",
      "sortSkuCard",
      "addSkuValue",
      "sortSkuValue"
    ]),
    vModel(key, index, value) {
      this.vModelSkuCard({ key, index, value });
    },
    sortCard(action, index) {
      // 上移
      this.sortSkuCard({ action, index });
    },
    chooseSkus() {
      // 选择规格
      this.app.chooseSkus(res => {
        this.vModel("name", this.index, res.name);
        this.vModel("type", this.index, res.type);
        this.vModel("list", this.index, res.list);
        this.list = res.list;
      });
    }
  }
};
</script>

<style></style>
