<template>
  <div class="wallet-container change-net">
    <nav-layout class="u-full-height">
      <div class="title">
        <span>{{ $t('setting.index.net') }}</span>
        <!-- <span
          class="editNet"
          @click="edit"
        >{{showclose ? $t('setting.index.done') : $t('setting.index.edit') }}</span>-->
      </div>

      <template>
        <div class="section-title">
          <div class="inner">
            <span>{{ $t('account.header.mainnet')}}</span>
          </div>
        </div>
        <div class="section-title">
          <div class="inner">
            <span>{{ $t('account.header.testnet') }}</span>
          </div>
        </div>
        <div class="section-title" v-for="(item,index) in netList" v-bind:key="index">
          <div class="inner">
            <span>{{ item.name }}</span>
            <img src="../static/colose.svg" @click.stop="delNet(index)" />
          </div>
        </div>
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
  padding: 0 24px;
  font-size: 15px;
  color: #1d213c;
  cursor: pointer;
  &:hover {
    background-color: #FAFBFC;
  }
  .inner {
    border-bottom: 1px solid #f0f3f7;
    line-height: 21px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
  }
  img {
    width: 15px;
    height: 15px;
    cursor: pointer;
    display: none;
  }
  &:hover {
    img {
      display: block;
    }
  }
}
.title {
  font-size: 20px;
  color: #21274a;
  line-height: 28px;
  font-weight: 500;
  margin-bottom: 30px;
  padding: 0 24px;
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
<style lang="scss">
.change-net {
  .layout-body {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
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
      let myselfNetWork = localStorage.getItem("myselfNetWork")
        ? JSON.parse(localStorage.getItem("myselfNetWork"))
        : null;
      if (myselfNetWork && myselfNetWork.name === this.netList[index].name) {
        localStorage.removeItem("myselfNetWork");
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
