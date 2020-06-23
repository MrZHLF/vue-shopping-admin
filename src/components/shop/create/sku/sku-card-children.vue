<template>
  <div
    class="border py-1 px-2 rounded mr-2 position-relative d-flex align-items-center"
  >
    <div v-if="type != 0">
      <!-- 颜色选择器 -->
      <el-color-picker v-if="type === 1" size="mini"></el-color-picker>
      <!-- 图片 -->
      <span v-else class="btn btn-light border" @click="chooseImage">
        <i class="el-icon-plus"></i>
      </span>
    </div>
    <input
      type="text"
      :value="item.name"
      @input="inputChange"
      class="form-control text-center border-0"
      style="width: 80px;font-size: 15px;"
    />
    <span
      class="btn btn-light p-0 position-absolute"
      style="line-height: 1;right: -10px;top: -10px;"
      @click="delSkuValue({ cardIndex: cardIndex, valueIndex: index })"
    >
      <i class="el-icon-circle-close"></i>
    </span>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  inject: ["app"],
  props: {
    type: {
      type: Number,
      default: 0
    },
    item: Object,
    index: Number,
    cardIndex: Number
  },
  methods: {
    ...mapMutations(["delSkuValue", "updateSkuValue"]),
    inputChange(e) {
      this.vModel("name", e.target.value);
      // console.log(e)
    },
    vModel(key, value) {
      this.updateSkuValue({
        cardIndex: this.cardIndex,
        valueIndex: this.index,
        key,
        value
      });
    },
    chooseImage() {
      // 选择图片
      this.app.chooseImage(res => {
        console.log(res);
      }, 2);
    }
  }
};
</script>

<style></style>
