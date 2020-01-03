<template>
  <div class="main-wrapper">
    <div class="content">
      <h5 class="page-title">{{$t('window.cdp.cdpshjy')}}</h5>
      <div class="cells">
        <div class="cell">
          <label class="cellName">{{$t('window.cdp.cjcdpdz')}}</label>
          <span class="addr cellValue">{{cutMiddleStr(address,6)}}</span>
        </div>
        <div class="cell">
          <label class="cellName">{{$t('window.cdp.gcdpCjjyid')}}</label>
          <span class="addr coin-card-copy" style="cursor: pointer;">{{cutMiddleStr(cdpTxId,6)}}</span>
        </div>
        <div class="cell">
          <label class="cellName">{{$t('window.cdp.ghl')}}</label>
          <span class="cellValue">{{scoins_to_repay/100000000}} WUSD</span>
        </div>
        <div class="cell">
          <label class="cellName">{{$t('window.cdp.shl')}}</label>
          <span class="cellValue">{{bcoins_to_redeem/100000000}} {{bcoins_symbol}}</span>
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
        <fees-slider v-model="fees" type="call-cdp" :feeName="feesName"></fees-slider>
      </div>
      <div class="button-wrapper">
        <button class="btn-lighter" @click="cancel">{{$t('window.cdp.qx')}}</button>
        <button class="btn-primary" @click="sureRedeemCDP">{{$t('window.cdp.qd')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import FeesSlider from "../components/fees-slider";
import API from "../api";
import WindowMixin from "./mixin";
import formatError from "../api/format-error";
import CopyMixin from "../components/copy-mixin";
export default {
  mixins: [WindowMixin, CopyMixin],
  components: { FeesSlider },
  data() {
    return {
      urlQuery: "",
      fees: 0.01,
      cdpTxId: "",
      scoins_to_repay: 0,
      bcoins_to_redeem: 0,
      clipboardSelector: ".coin-card-copy",
      feesName: "WICC",
      bcoins_symbol: ""
    };
  },
  created() {
    const query = this.$router.currentRoute.query;
    this.bcoins_to_redeem = query.wiccNum;
    this.bcoins_symbol = query.redeemSymbol;
    this.scoins_to_repay = query.wusdNum;
    this.cdpTxId = query.cdpTxId;
    this.callbackId = query.callbackId;
    console.log(query);
  },
  methods: {
    sureRedeemCDP() {
      this.$loading(this.$t("window.cdp.zzshjy")); //this.$t("window.transfer.confirmLoading")

      let param = {
        fees: parseFloat(this.fees) * Math.pow(10, 8),
        cdpTxId: this.cdpTxId,
        bcoins_symbol: this.bcoins_symbol,
        scoins_to_repay: this.scoins_to_repay,
        bcoins_to_redeem: this.bcoins_to_redeem,
        address: this.address,
        feeType: this.feesName
      };
      API.callRaw("cdpRedeem", { info: param }).then(
        res => {
          console.log(res);
          this.$loading.close();
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
    getCopyText() {
      return this.cdpTxId;
    }
  }
};
</script>
<style lang="scss">
@import "./common.scss";
</style>