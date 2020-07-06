<template>
  <div id="app">
    <router-view></router-view>
    <image-dialog ref="imageDialog" :max="maxChooseImage"></image-dialog>
    <skus-dialog ref="skusDialog"></skus-dialog>
  </div>
</template>

<script>
import imageDialog from "@/components/image/image-dialog.vue";
import skusDialog from "@/components/skus/skus-dialog.vue";
export default {
  name: "app",
  provide() {
    // 依赖注入
    return {
      app: this
    };
  },
  data() {
    return {
      maxChooseImage: 9
    };
  },
  components: {
    imageDialog,
    skusDialog
  },
  methods: {
    chooseImage(callback, max = 9) {
      // 选择图片
      this.maxChooseImage = max;
      this.$refs.imageDialog.chooseImage(callback);
    },
    chooseSkus(callback) {
      // 选择规格
      this.$refs.skusDialog.chooseSkus(callback);
    }
  }
};
</script>

<style>
::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 0;
}

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-thumb {
  cursor: pointer;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.25);
  transition: color 0.2s ease;
}
</style>
