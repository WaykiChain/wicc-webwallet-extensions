<template>
  <div class="wallet-container">
    <nav-layout class="u-full-height">
      <div class="title">
        <span>{{ $t('setting.index.net') }}</span>
        <span
          class="editNet"
          @click="edit"
        >{{showclose ? $t('setting.index.done') : $t('setting.index.edit') }}</span>
      </div>

      <template>
        <div class="section-title">
          <span>{{ $t('account.header.mainnet')}}</span>
        </div>
        <div class="section-title">
          <span>{{ $t('account.header.testnet') }}</span>
        </div>
        <div class="section-title" v-for="(item,index) in netList" v-bind:key="index">
          <span>{{ item.name }}</span>
          <img v-if="showclose" src="../static/colose.svg" @click="delNet(index)" />
        </div>
        <!-- <div class="addNet" @click="toAddNet">{{$t('setting.index.addNet')}}</div> -->
        <div class="addNet">
          <button
            class="display-block btn-higher btn-lighter"
            @click="toAddNet"
            style="font-weight:400;"
          >{{$t('setting.index.addNet')}}</button>
        </div>
      </template>
    </nav-layout>
  </div>
</template>

<style lang="scss" scoped>
@import "./header-tab.scss";
.section-title {
  border-bottom: 1px solid #F0F3F7;
  line-height: 21px;
  padding: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  color: #1D213C;
  > img {
    width: 15px;
    height: 15px;
    cursor: pointer;
  }
}
.title {
  font-size: 20px;
  color: #21274a;
  line-height: 28px;
  font-weight: 500;
  margin-bottom: 30px;
}
.editNet {
  cursor: pointer;
  position: absolute;
  right: 24px;
  color: #062deb;
  font-size: 15px;
}
.addNet {
  position: absolute;
  bottom: 24px;
  left: 0;
  width: 100%;
  padding: 0 24px;
  box-sizing: border-box;
}
</style>

<script type="text/jsx">
import NavLayout from "../components/nav-layout";

export default {
  name: "setting",

  created() {
    this.netList = JSON.parse(localStorage.getItem("netList"));
  },

  components: {
    NavLayout
  },

  methods: {
    edit() {
      this.showclose = !this.showclose;
    },
    toAddNet() {
      this.$router.push({ path: "addNet" });
    },
    delNet(index) {
      let myselfNetWork = localStorage.getItem("myselfNetWork") ? JSON.parse(localStorage.getItem("myselfNetWork")) : null
      if (myselfNetWork && myselfNetWork.name === this.netList[index].name) {
        localStorage.removeItem("myselfNetWork")
      }
      this.netList.splice(index, 1);
      localStorage.setItem("netList", JSON.stringify(this.netList));
    }
  },

  data() {
    return {
      showclose: false,
      netList: []
    };
  }
};
</script>
