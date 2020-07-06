<template>
  <table class="table table-sm table-bordered">
    <thead>
      <tr>
        <th
          scope="col"
          class="text-center"
          :rowspan="th.rowspan"
          :colspan="th.colspan"
          style="vertical-align: middle;"
          v-for="(th, thi) in tableThs"
          :key="thi"
        >
          {{ th.name }}
        </th>
      </tr>
      <tr>
        <th
          scope="col"
          class="text-center"
          rowspan="1"
          colspan="1"
          style="vertical-align: middle;"
          v-for="(th, thi) in skuLabels"
          :key="thi"
        >
          {{ th.name }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in list" :key="index">
        <!-- 商品规格 -->
        <th
          class="text-center"
          width="100"
          scope="row"
          v-for="(sku, skuI) in item.skus"
          :key="skuI"
        >
          {{ sku.name }}
        </th>
        <td class="text-center" width="100">
          {{ item.images }}
          <span
            v-if="!item.image"
            class="btn btn-light border"
            @click="chooseImage(item)"
          >
            <i class="el-icon-plus"></i>
          </span>
          <img
            v-else
            @click="chooseImage(item)"
            :src="item.image"
            class="rounded"
            style="width: 45px;height: 45px;cursor: pointer;"
          />
        </td>
        <td class="text-center" width="100">
          <input
            type="number"
            v-model="item.pprice"
            class="form-control text-center"
          />
        </td>
        <td class="text-center" width="100">
          <input
            type="number"
            v-model="item.oprice"
            class="form-control text-center"
          />
        </td>
        <td class="text-center" width="100">
          <input
            type="number"
            v-model="item.cprice"
            class="form-control text-center"
          />
        </td>
        <td class="text-center" width="100">
          <input
            type="number"
            v-model="item.stock"
            class="form-control text-center"
          />
        </td>
        <td class="text-center" width="100">
          <input
            type="number"
            v-model="item.volume"
            class="form-control text-center"
          />
        </td>
        <td class="text-center" width="100">
          <input
            type="number"
            v-model="item.weight"
            class="form-control text-center"
          />
        </td>
        <td class="text-center" width="100">
          <input
            type="text"
            v-model="item.code"
            class="form-control text-center"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  inject: ["app"],
  data() {
    return {
      list: []
    };
  },
  computed: {
    ...mapGetters(["tableThs", "tableData", "skuLabels"]),
    ...mapState({
      sku_card: state => state.goods_create.sku_card
    })
  },
  mounted() {
    this.list = this.tableData;
  },
  methods: {
    chooseImage(item) {
      // 选择图片
      this.app.chooseImage(res => {
        item.image = res[0].url;
      }, 1);
    }
  }
};
</script>

<style></style>
