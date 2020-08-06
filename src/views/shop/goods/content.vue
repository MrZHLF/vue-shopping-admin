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
    <div>
      <tinymce
        ref="editor"
        v-model="content"
        @onClick="onClick"
        toolbar="undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists table | removeformat | imageUpload"
      ></tinymce>
    </div>
    <el-button
      type="primary"
      style="position: absolute;bottom: 50px;right: 50px;"
      @click="onSubmit"
      >保存</el-button
    >
  </div>
</template>

<script>
import tinymce from "@/components/common/tinymce.vue";
export default {
  inject: ["app", "layout"],
  data() {
    return {
      content: "5151515",
      id: ""
    };
  },
  components: {
    tinymce
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
          let data = res.data.data;
          this.content = data.content;
          this.layout.hideLoading();
        })
        .catch(err => {
          this.layout.hideLoading();
        });
    },
    onClick(e) {
      console.log(e);
    },
    onSubmit() {
      this.layout.showLoading();
      this.axios
        .post(
          "/admin/goods/" + this.id,
          {
            content: this.content
          },
          { token: true }
        )
        .then(res => {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.$router.push({
            name: "shop_goods_list"
          });
          this.layout.hideLoading();
        })
        .catch(err => {
          this.layout.hideLoading();
        });
    }
  }
};
</script>

<style>
.goods_create .el-form-item {
  margin-bottom: 15px;
}
</style>
