<template>
	<li style="cursor: pointer;" class="list-group-item list-group-item-action d-flex align-items-center"
	:class="{'active sum-active':active}"  @click.stop="$emit('change',index)">
		{{item.name}} 
		<el-dropdown class="ml-auto">
		  <span class="btn btn-light btn-sm">
			{{item.num}}
			<i class="el-icon-arrow-down el-icon--right"></i>
		  </span>
		  <el-dropdown-menu slot="dropdown">
			<el-dropdown-item @click.stop.native="$emit('edit',{item,index})" >修改</el-dropdown-item>
			<el-dropdown-item @click.stop.native="$emit('del',index)">删除</el-dropdown-item>
		  </el-dropdown-menu>
		</el-dropdown>
	</li>
</template>

<script>
	export default {
		props:{
			active:{
				type:Boolean,
				default:false
			},
			item:Object,
			index:Number
		},
		methods:{
			albumChange(index){
				this.$emit('change',index)
			}
		}
	}
</script>

<style>
</style>
