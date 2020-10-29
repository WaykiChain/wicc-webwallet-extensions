<template>
  <nav-layout
    :title="name"
    class="wicc-record"
  >
    <div class="tokenCount">
      <div class="logo">
        <img
          :src="getIcon(name)"
          alt
        />
      </div>
      <p class="count">{{number}}</p>
      <p
        class="value"
        v-if="value"
      >{{value}}</p>
      <p
        class="value"
        v-else
      ></p>
    </div>
    <div class="footer">
      <button
        class="btn-lighter"
        @click="handleReceiveClick"
      >{{ $t('account.main.receiveButton')}}</button>
      <button
        class="btn-lighter"
        @click="gotoSend"
      >{{ $t('account.main.sendButton') }}</button>
    </div>
    <div class="trans-history-title">{{ $t('account.transHistory.title') }}</div>
    <div class="line"></div>
    <div class="history-container no-scrollbar">
      <trans-history
        :symbol="name"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="100"
        :transactions="transactions"
        :show-empty-block="!loading"
      ></trans-history>
    </div>
  </nav-layout>
</template>

<style lang="scss">
.wicc-record {
  overflow: hidden;
  .layout-footer {
    margin: 0 !important;
    padding: 0 !important;
  }
}
.wicc-record .layout-body {
  padding-left: 0px !important;
  padding-right: 0px !important;
}
</style>
<style scoped lang="scss">
.history-container {
  height: 248px;
  overflow: auto;
}
.trans-history-title {
  font-size: 16px;
  color: #1d213c;
  line-height: 21px;
  margin-bottom: 12px;
  font-weight: 500;
  padding: 0 20px;
}

.line {
  width: 500%;
  height: 0;
  border-bottom: 1px solid #f0f3f7;
  margin-left: -100%;
}
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
  transform: rotate(-40deg);
  animation-delay: 0.1s;
  animation: roll 300ms ease-out forwards;
  @keyframes roll {
    0% {
      transform: rotate(-45deg);
    }
    85% {
      transform: rotate(0deg);
    }
    92% {
      transform: rotate(-10deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
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
    font-weight: 500;
    color: #1d213c;
    line-height: 32px;
  }
  .value {
    font-size: 16px;
    color: #8187a5;
    height: 21px;
    line-height: 21px;
    width: 100%;
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
    NavLayout,
  },
  watch: {
    activeAddress(val) {
      this.refresh();
    },
  },
  created() {
    this.number = this.$route.query.coinNum;
    this.name = this.$route.query.coinName;
    this.value = this.$route.query.value;
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    getIcon(key) {
      if (
        !["WICC", "WUSD", "WGRT", "ROG", "XUSD"].includes(
          String(key).toUpperCase()
        )
      ) {
        return require(`../../static/wicclogo.svg`);
      }
      return require(`../../static/${
        key === "WICC" ? "wicclogo" : key.toLowerCase()
      }.svg`);
    },
    refresh(silence = false) {
      // if (this.currentpage === 1) {
      this.$loading(this.$t("common.loading"));
      // }
      this.busy = true;
      const param = {
        address: this.activeAddress,
        currentpage: this.currentpage,
        pagesize: 10,
        coinsymbol: this.name,
        // txtype:'BCOIN_TRANSFER_TX'
      };
      API.getTransHistory({ info: param }).then(
        (value) => {
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
        (err) => {
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
          coinType: this.name,
          tokens: this.$route.query.tokens,
        },
      });
    },
    handleReceiveClick() {
      this.$router.push("/account/collect?address=" + this.activeAddress);
    },
  },

  data() {
    return {
      loading: false,
      number: null,
      name: null,
      value: null,
      transactions: null,
      activeAccountInfo: null,
      busy: true,
      currentpage: 1,
      tokens: null,
    };
  },
};
</script>