<template>
	<el-form ref="form" label-width="80px">
		<el-form-item label="市场价格">
			<el-input type="number" :value="oprice" @input="vModel('oprice',$event)"
				class="w-25">
					<template slot="append">元</template>
				</el-input>
		</el-form-item>
		<el-form-item label="销售价格">
			<el-input type="number"  :value="pprice" @input="vModel('pprice',$event)"
				class="w-25">
					<template slot="append">元</template>
				</el-input>
		</el-form-item>
		<el-form-item label="成本价格">
			<el-input type="number"  :value="cprice" @input="vModel('cprice',$event)"
				class="w-25">
					<template slot="append">元</template>
				</el-input>
		</el-form-item>
		<el-form-item label="商品重量">
			<el-input type="number"  :value="weight" @input="vModel('weight',$event)"
				class="w-25">
					<template slot="append">公斤</template>
				</el-input>
		</el-form-item>
		<el-form-item label="商品体积">
			<el-input type="number"  :value="volume" @input="vModel('volume',$event)"
				class="w-25">
					<template slot="append">立方平</template>
				</el-input>
		</el-form-item>
	</el-form>
</template>

<script>
	import { mapState,mapMutations } from 'vuex'
	export default {
		data() {
			return {
				
			}
		},
		computed:{
			...mapState({
				oprice:state=>state.goods_create.oprice, // 市场价格
				pprice:state=>state.goods_create.pprice, // 销售价格
				cprice:state=>state.goods_create.cprice, // 成本价格
				weight:state=>state.goods_create.weight, // 重量
				volume:state=>state.goods_create.volume, // 体积
			})
		},
		methods: {
			...mapMutations(['vModelState']),
			//修改表单值
			vModel(key,value) {
				this.vModelState({key,value})
			}
		}
	}
</script>

<style>
</style>
