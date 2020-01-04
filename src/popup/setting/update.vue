<template>
  <div class="wallet-container">
    <div class="u-full-height">
      <div class="title">更新提示（v2.2.0）</div>
      <div class="content-title">WaykiMax已更新以下内容</div>
      <div class="content-item">1、整体页面优化；</div>
      <div class="content-item">2、优化所有页面的功能，让产品更加健壮；</div>
      <div class="content-item">3、修复一些问题，提升流畅度。</div>
      <div class="btn-container">
        <button class="btn-lighter" @click="cancel">下次再说</button>
        <button class="btn-primary"><a href="https://wiccdev.org/tool/WaykiMax/index.html" target="_blank"></a>前往更新 </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "./header-tab.scss";
.u-full-height {
  padding: 0 24px;
  background: url("../static/about-logo.png") no-repeat 190px top;
  background-size: 224px 168px;
}

.title {
  font-size: 20px;
  color: #21274a;
  line-height: 28px;
  font-weight: 500;
  margin-bottom: 50px;
  padding-top: 70px;
}

.content-title {
  font-size: 15px;
  line-height: 21px;
  color: #21274a;
  margin-bottom: 15px;
}

.content-item {
  line-height: 18px;
  font-size: 13px;
  color: #8187A5;
  margin-bottom: 6px;
}

.btn-container {
  margin-top: 50px;
  display: flex;
  justify-content: space-between;
  button {
    width: 150px;
  }
  .btn-primary {
    position: relative;
  }
  a {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    color: #fff;
  }
}
</style>

<script type="text/jsx">
import NavLayout from "../components/nav-layout";
import { getLanguage, setLanguage } from "../locale";

export default {
  name: "setting",

  components: {
    NavLayout
  },

  methods: {
    cancel() {
      sessionStorage.setItem("isActive", 1)
      this.$router.go(-1)
    }
  },

  data() {
    return {
      tab: "setting",
      language: null
    };
  }
};
</script>
