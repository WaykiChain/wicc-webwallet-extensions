<template>
  <div class="content-wrapper">
    <nav-bar :title="$t('account.send.title')"></nav-bar>
    <div class="content-body">
      <div class="from-title">{{ $t('account.send.fromLabel') }}</div>
      <div class="from-address">{{ activeAddress }}</div>
      <label
        class="transfer-limit"
      >{{$t('account.sendToken.limit')}}&nbsp;{{balance}} &nbsp;{{coinType}}</label>
      <wallet-input
        v-model="destAddr"
        :label="$t('account.send.destLabel')"
        :placeholder="$t('account.send.destPlaceHolder')"
      ></wallet-input>

      <wallet-input
        v-model="value"
        type="number"
        :postfix="coinType"
        :label="$t('account.send.valueLabel')"
        :placeholder="$t('account.send.valuePlaceHolder')"
      ></wallet-input>

      <wallet-input v-model="desc" :label="$t('account.send.descLabel')"></wallet-input>

      <div class="feesView">
        <select class="feesName" name="WICC" id v-model="feesName">
          <option value="WICC">WICC</option>
          <option value="WUSD">WUSD</option>
        </select>
        <fees-slider v-model="fees" type="call-cdp" :feeName="feesName"></fees-slider>
      </div>
    </div>

    <div class="content-footer">
      <div class="bottom_btn">
        <div class="btn" @click="cancel">{{$t('window.cdp.qx')}}</div>
        <div class="btn sure" @click="confirmSend">{{$t('window.cdp.qd')}}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content-wrapper {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.content-body {
  margin-top: 20px;
  flex: 1 0 0;
  padding: 0 16px 7px;
  position: relative;
}
.transfer-limit {
  position: absolute;
  display: inline-block;
  top: 158px;
  right: 17px;
  z-index: 0;
  font-size: 12px;
  font-weight: 400;
  line-height: 22px;
  color: rgba(165, 174, 193, 1);
}
.content-footer {
  padding: 0 16px;
}

.from-title,
.from-address {
  color: #717680;
  font-size: 14px;
  padding: 2px;
}

.from-address {
  margin-bottom: 10px;
}
.feesView {
  padding-top: 47px;
  position: relative;
  .feesName {
    border: none;
    position: absolute;
    top: 10px;
    right: 0px;
  }
}
.bottom_btn {
  display: flex;
  justify-content: flex-start;
  margin-top: 16px;
  .btn {
    width: calc(50% - 24px);
    margin-left: 16px;
    text-align: center;
    font-size: 16px;
    line-height: 48px;
    border-radius: 4px;
    border: 1px #b4bccc solid;
    cursor: pointer;
  }
  .sure {
    background: -webkit-linear-gradient(
      #3c78ea,
      #004eec
    ); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#3c78ea, #004eec); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#3c78ea, #004eec); /* Firefox 3.6 - 15 */
    background: linear-gradient(#3c78ea, #004eec); /* 标准的语法 */
    color: white;
    border: none;
  }
}
</style>

<script type="text/jsx">
import WalletInput from "../components/input";
import NavBar from "../components/nav-bar";
import FeesSlider from "../components/fees-slider";
import API from "../api";
import formatError from "../api/format-error";
import StateWatcher from "../account/state-watcher";
import WindowMixin from "./mixin";

export default {
  components: {
    WalletInput,
    FeesSlider,
    NavBar
  },

  mixins: [StateWatcher, WindowMixin],

  created() {
    const query = this.$router.currentRoute.query;
    const assetMap = JSON.parse(query.assetMap)[0];
    this.coinType = assetMap.coinSymbol;
    this.destAddr = assetMap.destAddr;
    this.value = assetMap.amount;
    if (isNaN(parseInt(this.value))) {
      this.$toast("Invalid Amount");
      this.value = 0;
    }
    this.desc = query.memo;
    this.value = this.value / Math.pow(10, 8);
    this.callbackId = query.callbackId;
    console.log(query);
  },
  watch: {
    activeAddress(val) {
      this.getWiccNum(val);
    }
  },

  computed: {
    valid() {
      return this.destAddr && this.value;
    }
  },

  methods: {
    confirmSend() {
      if (!this.validateAddress(this.destAddr)) return;

      if (this.value < 0.0001) {
        this.$toast(this.$t("errors.amountLessThanLimit"), {
          type: "center"
        });

        return;
      }

      if (this.balance && this.value > this.balance - this.fees - 0.00001) {
        this.$toast(this.$t("errors.insufficientBalance"), {
          type: "center"
        });
        return;
      }

      this.$loading(this.$t("account.send.confirmLoading"));

      let param = {
        address: this.activeAddress,
        destAddr: this.destAddr,
        value: this.value,
        fees: this.fees,
        coinType: this.coinType,
        feeSymbol: this.feesName,
        memo: this.desc
      };
      this.callRaw("variousCoinsTx", param);
    },

    callRaw(method, param) {
      API.callRaw(method, { info: param }).then(
        res => {
          console.log(res);
          this.$loading.close();
          this.$toast(this.$t("account.send.sendSuccess"), {
            type: "center"
          });
          if (this.callbackId) {
            API.callPageCallback(this.callbackId, null, res);
            this.$toast("Success", {
              type: "center",
              duration: 1000,
              wordWrap: true
            });
            setTimeout(() => {
              window.close();
            }, 300);
          }
        },
        error => {
          this.$loading.close();
          this.$toast(
            this.$t("window.transfer.createFailure") + " " + formatError(error),
            {
              type: "center",
              duration: 5000,
              wordWrap: true
            }
          );
          if (this.callbackId) {
            API.callPageCallback(this.callbackId, error, null);
          }
        }
      );
    },
    getWiccNum(address) {
      let net = localStorage.getItem("network");
      API.getAccountInfo(net, address).then(
        res => {
          console.log(res);
          let tokens = res.tokens;
          if (tokens) {
            this.tokens = tokens;
            if (this.coinType == "WICC") {
              this.balance = tokens.WICC.freeAmount / Math.pow(10, 8);
            } else if (this.coinType == "WUSD") {
              this.balance = tokens.WUSD.freeAmount / Math.pow(10, 8);
            } else if (this.coinType == "WGRT") {
              this.balance = tokens.WGRT.freeAmount / Math.pow(10, 8);
            }
          } else {
            this.tokens = null;
          }
        },
        error => {
          console.log(error);
          this.$toast(error.message, {
            type: "center"
          });
        }
      );
    }
  },

  data() {
    return {
      tokens: null,
      balance: null,
      destAddr: null,
      value: null,
      desc: null,
      fees: 0.01,
      feesName: "WICC",
      coinType: ""
    };
  }
};
</script>
