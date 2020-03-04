<template>
  <div class="main-wrapper">
    <div class="content">
      <div class="page-title">{{ $t('account.send.title') }}</div>
      <div class="value-block">
        <div class="value">-{{ value }} {{coinType}}</div>
      </div>
      <div class="cells">
        <div class="cell">
          <label>{{ $t('window.transfer.addressLabel') }}</label>
          <span class="">{{ cutMiddleStr(address, 6) }}</span>
        </div>
        <div class="cell">
          <label>{{ $t('window.transfer.destAddressLabel') }}</label>
          <span class="">{{ cutMiddleStr(destAddr, 6) }}</span>
        </div>
        <div class="cell" v-if="desc">
          <label>{{ $t('account.transDetail.commentLabel') }}</label>
          <span>{{ desc }}</span>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="feesView">
        <div
          class="feesName"
          :class="{down: showFeeType}"
          @click="setTypeShow"
          v-click-outside="setTypeHide"
        >
          <span>{{feesName}}</span>
          <wallet-select
            :options="[{value: 'WICC'}, {value: 'WUSD'}]"
            :value="feesName"
            :show="showFeeType"
            @on-change="handleFeeTypeChange"
          ></wallet-select>
        </div>
        <fees-slider v-model="fees" type="wiccTX"></fees-slider>
      </div>
      <div class="button-wrapper">
        <button class="btn-lighter" @click="cancel">{{ $t('window.transfer.closeButton') }}</button>
        <button class="btn-primary" @click="confirmSend">{{ $t('window.transfer.confirmButton') }}</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "./common.scss";
.main-wrapper {
  .value-block {
    border-bottom: 1px solid #f0f3f7;
    margin-bottom: 24px;
    .value {
      font-size: 18px;
      color: #1d213c;
      font-weight: 500;
      line-height: 24px;
      padding-bottom: 24px;
    }
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
    this.feesName = this.coinType === 'WUSD' ? 'WUSD' : 'WICC';
    this.destAddr = assetMap.destAddr;
    this.value = assetMap.amount;
    if (isNaN(parseInt(this.value))) {
      this.$toast("Invalid Amount");
      this.value = 0;
    }
    this.desc = query.memo;
    this.value = this.value / Math.pow(10, 8);
    this.callbackId = query.callbackId;
    this.raw = query.raw;
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
      if (this.raw == "1") {
        this.callRaw("variousCoinsRaw", param);
      } else {
        this.callRaw("variousCoinsTx", param);
      }
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
          // if (this.callbackId) {
          //   API.callPageCallback(this.callbackId, error, null);
          // }
        }
      );
    },
    getWiccNum(address) {
      let net = localStorage.getItem("network");
      API.getAccountInfo(net, address).then(
        res => {
          console.log(res);
          let tokens = res.tokens;
          if (Object.keys(tokens).length > 0) {
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
      fees: 0.001,
      feesName: "WICC",
      coinType: "",
      raw: ""
    };
  }
};
</script>
