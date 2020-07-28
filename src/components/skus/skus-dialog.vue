<template>
  <el-dialog
    title="商品规格选择"
    :visible.sync="createModel"
    width="80%"
    top="5vh"
  >
    <!-- <el-container > -->
    <el-container style="height: 70vh;position: relative;margin: -30px -20px;">
      <el-aside
        width="200px"
        style="position: absolute;top: 0;left: 0;bottom: 50px;"
        class="bg-white border-right"
      >
        <!-- 侧边 -->
        <ul class="list-group list-group-flush">
          <li
            class="list-group-item list-group-item-action"
            v-for="(item, index) in skusList"
            :key="index"
            :class="skuIndex === index ? 'sum-active' : ''"
            @click="changeSku(index)"
          >
            {{ item.name }}
          </li>
        </ul>
      </el-aside>
      <el-footer
        style="position: absolute;left:0;bottom:0;height: 50px;width: 200px;display: flex;align-items: center;justify-content: center;"
        class="border"
      >
        <el-pagination
          :current-page="page.current"
          :page-sizes="page.sizes"
          :page-size="page.size"
          layout="prev, next"
          :total="page.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </el-footer>
      <el-container>
        <el-header
          style="position: absolute;top: 0;left: 200px;right: 0;height: 60px;line-height: 60px;"
          class="border-top border-bottom"
        >
          <el-button type="primary" size="mini" @click="doChooseAll">
            {{ isChooseAll ? "取消全选" : "全选" }}
          </el-button>
        </el-header>
        <el-main
          style="position: absolute;top: 60px;left: 200px;bottom: 0;right: 0;"
        >
          <!-- 主内容 -->
          <div class="d-flex flex-wrap">
            <span
              class="border rounded py-1 px-2 m-1"
              style="cursor: pointer;"
              v-for="(item, index) in skuItem"
              :key="index"
              :class="item.ischeck ? 'sum-active' : ''"
              @click="choose(item)"
              >{{ item.name }}</span
            >
          </div>
        </el-main>
      </el-container>
    </el-container>
    <!-- </el-container> -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="hide">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import common from "@/common/mixins/common";
export default {
  mixins: [common],
  data() {
    return {
      preUrl: "skus",
      loading: false,
      createModel: false,
      callback: false,
      chooseList: [], //选中数组
      skuIndex: 0,
      skusList: []
    };
  },
  computed: {
    skuItem() {
      let item = this.skusList[this.skuIndex];
      return item ? item.list : [];
    },
    // 是否全选
    isChooseAll() {
      return this.skuItem.length === this.chooseList.length;
    }
  },
  methods: {
    getListResult(e) {
      this.skusList = e.list.map(item => {
        let list = item.default.split(",");
        item.list = list.map(name => {
          return {
            name: name,
            image: "",
            color: "",
            ischeck: false
          };
        });
        return item;
      });
    },
    chooseSkus(callback) {
      this.callback = callback;
      this.createModel = true;
    },
    confirm() {
      // 选中的图片skus
      if (typeof this.callback === "function") {
        let item = this.skusList[this.skuIndex];
        this.callback({
          id: item.id,
          name: item.name,
          type: item.type,
          list: this.chooseList
        });
      }

      this.hide();
    },
    hide() {
      this.unChooseAll();
      this.createModel = false;
      this.callback = false;
    },
    changeSku(index) {
      // 切换规格卡片
      this.unChooseAll();
      this.skuIndex = index;
    },
    choose(item) {
      // 选择规格属性
      if (!item.ischeck) {
        // 之前没有选中
        this.chooseList.push(item);
        return (item.ischeck = true);
      }
      // 之前选中的
      let index = this.chooseList.findIndex(v => {
        return v.id == item.id;
      });
      if (index < 0) return;
      this.chooseList.splice(index, 1);
      item.ischeck = false;
    },
    doChooseAll() {
      // 是否全选
      let list = this.skusList[this.skuIndex].list;
      if (this.isChooseAll) {
        return this.unChooseAll();
      }
      // 全选
      this.chooseList = list.map(v => {
        v.ischeck = true;
        return v;
      });
    },
    unChooseAll() {
      // 取消全选
      let list = this.skusList[this.skuIndex].list;
      list.forEach(v => {
        v.ischeck = false;
      });
      this.chooseList = [];
    }
  }
};
</script>

<style>
.sum-active {
  background-color: teal;
  color: #ffffff;
}
</style>
