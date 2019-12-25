<template>
  <nav-layout :title="name" class="wicc-record">
    <div class="tokenCount">
      <div class="logo animated wobble">
        <img :src="getIcon(name)" alt />
      </div>
      <p class="count">{{number}}</p>
      <p class="value">≈$ {{number}}</p>
    </div>
    <div class="footer">
      <button class="btn-lighter" @click="gotoSend">{{ $t('account.main.sendButton') }}</button>
      <button class="btn-lighter" @click="handleReceiveClick">{{ $t('account.main.receiveButton') }}</button>
    </div>
    <template>
      <trans-history
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="busy"
        infinite-scroll-throttle-delay="1000"
        infinite-scroll-distance="0"
        :transactions="transactions"
        :show-empty-block="!loading"
      ></trans-history>
    </template>
  </nav-layout>
</template>

<style lang="scss">
.wicc-record {
  overflow: hidden;
}
.wicc-record .layout-body {
  padding-left: 20px !important;
  padding-right: 20px !important;
}
</style>
<style scoped lang="scss">
.button-wrapper {
  > button {
    flex: 1 0 0;
  }

  > button:first-child {
    margin-right: 10px;
  }
}
p {
  margin-bottom: 0;
}
.logo {
  width: 60px;
  height: 60px;
  margin: auto;
  margin-bottom: 12px;
  animation-duration: 800ms;
  img {
    width: 60px;
  }
}
.backView {
  text-align: center;
  box-sizing: border-box;

  img {
    position: absolute;
    left: 5px;
    top: 10px;
  }
  p {
    line-height: 54px;
    font-size: 18px;
    color: #5b5f67;
  }
}
.tokenCount {
  text-align: center;
  font-size: 14px;
  padding-top: 16px;
  .count {
    font-size: 24px;
    font-weight: 450;
    color: #1d213c;
    line-height: 32px;
  }
  .value {
    font-size: 16px;
    color: #8187a5;
    line-height: 21px;
  }
}
.footer {
  margin-top: 20px;
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  button {
    margin: 0 6px;
    width: 134px;
  }
}
</style>

<script type="text/jsx">
import API from "../../api";
import vueiInfinite from "vue-infinite-scroll";
import Vue from "vue";
Vue.use(vueiInfinite);
import TransHistory from "../components/wiccs-history";
import StateWatcher from "../state-watcher";
import NavLayout from "../../components/nav-layout";
import { openQrCodeDialog } from "../dialog";
export default {
  mixins: [StateWatcher],

  components: {
    TransHistory,
    NavLayout
  },
  watch: {
    activeAddress(val) {
      this.refresh();
    }
  },
  created() {
    this.number = this.$route.query.coinNum;
    this.name = this.$route.query.coinName;
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    getIcon(key) {
      return require(`../../static/${
        key === "WICC" ? "wicclogo" : key.toLowerCase()
      }.svg`);
    },
    refresh(silence = false) {
      if (!silence) {
        this.$loading(this.$t("common.loading"));
      }
      this.busy = true;
      const param = {
        address: this.activeAddress,
        currentpage: this.currentpage,
        pagesize: 10,
        coinsymbol: this.name
        // txtype:'BCOIN_TRANSFER_TX'
      };
      API.getTransHistory({ info: param }).then(
        value => {
          console.log("==============", value);
          this.$loading.close();
          this.loading = false;
          if (this.currentpage == 1) {
            this.busy = false;
            this.transactions = value.transactions;
          } else {
            if (value.transactions.length > 0) {
              this.busy = false;
              this.transactions.push.apply(
                this.transactions,
                value.transactions
              );
            } else {
              // this.$toast('数据加载完毕')
            }
          }
        },
        err => {
          console.log(err);
          this.$loading.close();
          this.$toast(err.message);
          this.loading = false;
        }
      );
    },
    loadMore() {
      this.currentpage++;
      this.refresh();
    },
    gotoSend() {
      this.$router.push({
        name: "send",
        query: {
          balance: this.number,
          coinType: this.name
        }
      });
    },
    handleReceiveClick() {
      this.$router.push("/account/collect?address=" + this.activeAddress)
    }
  },

  data() {
    return {
      loading: false,
      number: null,
      name: null,
      transactions: null,
      activeAccountInfo: null,
      busy: true,
      currentpage: 1
    };
  }
};
</script>