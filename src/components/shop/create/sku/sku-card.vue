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
      <el-button size="mini" type="danger" @click="delSkuCardEvent"
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
          @click="addSkuValueEvent"
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
let defaultVal = ["属性值", "#FFFFFF", "/favicon.ico"];
export default {
  inject: ["app", "layout"],
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
  computed: {
  	...mapState({
		sku_card:state =>state.goods_create.sku_card
	})
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
		this.axios.post('/admin/goods_skus_card_value/sort',{
			sortdata:this.list.map((item,index) =>{
				return {
					id:item.id,
					order:index + 1
				}
			},{token:true})
		})
		
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
    delSkuCardEvent() {
      this.layout.showLoading();
      this.axios
        .post(
          `/admin/goods_skus_card/${this.item.id}/delete`,
          {},
          { token: true }
        )
        .then(res => {
          this.delSkuCard(this.index);
          this.layout.hideLoading();
        })
        .catch(err => {
          this.layout.hideLoading();
        });
    },
    addSkuValueEvent(value=false) {
      this.layout.showLoading();
      this.axios
        .post(
          "/admin/goods_skus_card_value",
          {
            goods_skus_card_id: this.item.id,
            name: this.item.name,
            order: 50,
            value: value==='string' ? value : defaultVal[this.item.type]
          },
          { token: true }
        )
        .then(res => {
          let data = res.data.data;
          data.text = this.item.type ===0 ? data.value : defaultVal[0];
          data.color =this.item.type ===1 ? data.value : defaultVal[1];
          data.image = this.item.type ===2 ? data.value : defaultVal[2];
          this.layout.hideLoading();
          this.addSkuValue({
            index: this.index,
            data
          });
        })
        .catch(err => {
          this.layout.hideLoading();
        });
    },
    updateSkuCard() {
      this.axios.post("/admin/goods_skus_card/" + this.item.id, this.item, {
        token: true
      });
    },
    vModel(key, index, value) {
      this.vModelSkuCard({ key, index, value });
      this.updateSkuCard();
    },
    sortCard(action, index) {
      // 上移
      this.sortSkuCard({ action, index });
	  this.axios.post('/admin/goods_skus_card/sort',{
		sortdata: this.sku_card.map((item,index) =>{
			return {
				id:item.id,
				order:index +1 
			}
		})
	  },{token:true})
    },
    chooseSkus() {
      // 选择规格
      this.app.chooseSkus(res => {
        this.vModel("name", this.index, res.name);
        this.vModel("type", this.index, res.type);
        // this.vModel("list", this.index, res.list);
        // this.list = res.list;
		res.list.forEach(item =>{
			this.addSkuValueEvent(item.name)
		})
      });
    }
  }
};
</script>

<style></style>
