<template>
	<div class="bg-white px-3 goods_create" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
		<router-link :to="{ name: 'shop_goods_list' }" style="position: absolute;top: 12px;left: 180px;"><el-button size="mini">返回商品列表</el-button></router-link>
		<el-tabs v-model="tabIndex" @tab-click="handleClick">
			<el-tab-pane label="基础设置">
				<base-create/>
			</el-tab-pane>
			<el-tab-pane label="商品规格">
				<el-form ref="form" label-width="80px">
					<el-form-item label="商品规格">
						<el-radio-group :value="skus_type" @input="vModel('skus_type',$event)" size="medium">
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
							<sku-card v-for="(item,index) in sku_card" :key="index" :item="item" :index="index" :total="skuCardTotal"></sku-card>
							<el-button type="success" size="mini" @click="addSkuCard">添加规格</el-button>
						</el-form-item>
					</el-form>
					
					
					<el-form ref="form"  label-width="80px">
						<el-form-item label="批量设置">
							<el-button type="text">销售价</el-button>
							<el-button type="text">市场价</el-button>
							<el-button type="text">成本价</el-button>
							<el-button type="text">库存</el-button>
							<el-button type="text">体积</el-button>
							<el-button type="text">重量</el-button>
						</el-form-item>
						<el-form-item label="规格设置">
							<sku-table></sku-table>
							
							
						</el-form-item>
					</el-form>
				</template>
			</el-tab-pane>
			<el-tab-pane label="商品属性">商品属性</el-tab-pane>
			<el-tab-pane label="媒体设置">媒体设置</el-tab-pane>
			<el-tab-pane label="商品详情">商品详情</el-tab-pane>
			<el-tab-pane label="折扣设置">折扣设置</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import { mapState,mapMutations } from 'vuex'
	import baseCreate from '@/components/shop/create/base-create.vue';
	import singleAttrs from '@/components/shop/create/single-attrs.vue';
	import skuCard from '@/components/shop/create/sku/sku-card.vue';
	import skuTable from '@/components/shop/create/sku-table.vue';
export default {
	components:{
		baseCreate,
		singleAttrs,
		skuCard,
		skuTable
	},
	data() {
		return {
			tabIndex: 0,
			
		};
	},
	computed:{
		...mapState({
			skus_type: state=>state.goods_create.skus_type, //0单规格1多规格
			title: state=>state.goods_create.title,
			category: state=>state.goods_create.category,
			desc: state=>state.goods_create.desc, //描述
			unit:state=>state.goods_create.unit, //商品单位
			stock:state=>state.goods_create.stock, //总库存
			min_stock:state=>state.goods_create.min_stock, //库存预警
			display_stock:state=>state.goods_create.display_stock, //库存显示
			status:state=>state.goods_create.status, //是否上架
			express: state=>state.goods_create.express, //运费模板
			oprice:state=>state.goods_create.oprice, // 市场价格
			pprice:state=>state.goods_create.pprice, // 销售价格
			cprice:state=>state.goods_create.cprice, // 成本价格
			weight:state=>state.goods_create.weight, // 重量
			volume:state=>state.goods_create.volume, // 体积
			
			sku_card:state=>state.goods_create.sku_card, //规格
		}),
		skuCardTotal() {
			// 是否是最后一个,规格卡片总数
			return this.sku_card.length
		}
	},
	mounted() {
		
	},
	methods: {
		...mapMutations(['vModelState','addSkuCard']),
		//修改表单值
		vModel(key,value) {
			this.vModelState({key,value})
		},
		handleClick(tab, event) {
			//tab切换
			console.log(tab.index);
		}
	}
};
</script>

<style>
	.goods_create .el-form-item{
		margin-bottom: 15px;
	}
</style>
