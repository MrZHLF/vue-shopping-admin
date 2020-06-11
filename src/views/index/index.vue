<template>
  <div>
    <!-- 数据统计 -->
    <el-row :gutter="24">
      <el-col :span="6" v-for="(item, index) in counts" :key="index">
        <el-card class="box-card" shadow="hover">
          <div class="d-flex align-items-center">
            <i
              :class="[item.icon, item.color]"
              class="h4 mb-0  text-white border text-center mr-3"
              style="width: 40px;height: 40px;line-height: 40px;"
            ></i>
            <div>
              <h4 class="mb-1">{{ item.num }}</h4>
              <small class="text-muted">{{ item.desc }}</small>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 店铺 订单提示 | 统计图 -->
    <el-row :gutter="20" class="mt-3">
      <!-- 店铺 订单提示 -->
      <el-col
        :span="12"
        class="d-flex flex-column"
        style="height: 370px;justify-content: space-between;"
      >
        <el-card
          class="box-card mb-auto"
          shadow="never"
          v-for="(tip, ti) in tips"
          :key="ti"
        >
          <div slot="header" class="clearfix">
            <span>{{ tip.title }}</span>
            <el-button style="float: right; padding: 3px 0" type="text">{{
              tip.desc
            }}</el-button>
          </div>
          <div class="row">
            <div
              :class="tip.list.length | getCol"
              v-for="(tilist, listi) in tip.list"
              :key="listi"
            >
              <button type="default" class="btn btn-light w-100">
                <h4 class="mb-1">{{ tilist.value }}</h4>
                <small class="text-muted">{{ tilist.name }}</small>
              </button>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <!-- 统计图 -->
        <el-card class="box-card" style="height: 370px;">
          <div slot="header" class="clearfix">
            <span>卡片名称</span>
            <el-button style="float: right; padding: 3px 0" type="text"
              >操作按钮</el-button
            >
          </div>
          <!-- <div class="text item"></div> -->
          <!-- 统计图 -->
          <div ref="myChart" style="width: 100%x;height:270px;"></div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 销售情况统计 | 单品销售排名 -->
    <el-row :gutter="20" class="my-3" >
      <el-col :span="12">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>卡片名称</span>
            <el-button style="float: right; padding: 3px 0" type="text"
              >操作按钮</el-button
            >
          </div>
          <div class="media align-items-center border">
            <span class="py-4 px-3 bg-light borde-right">昨日销量</span>
            <div class="media-body">
              <div class="border-bottom pl-3 pb-2 mb-2">
                <span>订单量(件)</span>12
              </div>
              <div class="pl-3"><span>订单量(件)</span>12</div>
            </div>
          </div>
          <div class="media align-items-center border mt-3">
            <span class="py-4 px-3 bg-light borde-right">昨日销量</span>
            <div class="media-body">
              <div class="border-bottom pl-3 pb-2 mb-2">
                <span>订单量(件)</span>12
              </div>
              <div class="pl-3"><span>订单量(件)</span>12</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>单品销售排名</span>
            <el-button style="float: right; padding: 3px 0" type="text"
              >按周期统计商家店铺订单量和订单金额</el-button
            >
          </div>

          <el-table :data="tableData" height="200" border style="width: 100%">
            <el-table-column type="index"  label="#" width="50">
            </el-table-column>
			<el-table-column prop="name" label="商品信息">
			</el-table-column>
			<el-table-column prop="num"  label="销量" width="50">
			</el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data() {
    return {
      tableData: [
		{
			name:"小天鹅机器人",
			num:'9'
		},
		{
			name:"小天鹅机器人",
			num:'9'
		},
		{
			name:"小天鹅机器人",
			num:'9'
		}
	  ],
      counts: [
        {
          icon: 'el-icon-user-solid',
          num: '30',
          desc: '关注人数(个)',
          color: 'bg-primary',
        },
        {
          icon: 'el-icon-s-finance',
          num: '120',
          desc: '订单总数(笔)',
          color: 'bg-success',
        },
        {
          icon: 'el-icon-s-order',
          num: '4183.80',
          desc: '今日订单总金额(元)',
          color: 'bg-danger',
        },
        {
          icon: 'el-icon-s-data',
          num: '100',
          desc: '本月销售(笔)',
          color: 'bg-warning',
        },
      ],
      tips: [
        {
          title: '店铺及商品提示',
          desc: '需要关注的店铺信息及待处理事项',
          list: [
            { name: '出售中', value: '64' },
            { name: '待回复', value: '10' },
            { name: '库存预警', value: '0' },
            { name: '仓库中', value: '3' },
          ],
        },
        {
          title: '交易提示',
          desc: '你需要立即处理的交易订单',
          list: [
            { name: '待付款', value: '0' },
            { name: '待发货', value: '10' },
            { name: '已发货', value: '0' },
            { name: '已收货', value: '3' },
            { name: '退款中', value: '3' },
            { name: '待售后', value: '3' },
          ],
        },
      ],
    }
  },
  filters: {
    getCol(total) {
      return `col-${12 / total}`
    },
  },
  mounted() {
    // 画统计图
    this.drawLine()
  },
  methods: {
    drawLine() {
      let myChart = echarts.init(this.$refs.myChart) //初始化
      myChart.setOption({
        //配置参数
        title: {},
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        legend: {
          data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎'],
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: '邮件营销',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: [120, 132, 101, 134, 90, 230, 210],
          },
          {
            name: '联盟广告',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: [220, 182, 191, 234, 290, 330, 310],
          },
          {
            name: '视频广告',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: [150, 232, 201, 154, 190, 330, 410],
          },
          {
            name: '直接访问',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: [320, 332, 301, 334, 390, 330, 320],
          },
          {
            name: '搜索引擎',
            type: 'line',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'top',
              },
            },
            areaStyle: {},
            data: [820, 932, 901, 934, 1290, 1330, 1320],
          },
        ],
      })
    },
  },
}
</script>

<style></style>
