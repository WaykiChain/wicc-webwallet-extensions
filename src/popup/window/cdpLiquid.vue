<template>
  <div class="main-wrapper">
    <div class="content">
      <h5 class="page-title">{{$t('window.cdp.cdpqsjy')}}</h5>
      <div class="cells">
        <div class="cell">
          <label class="cellName">{{$t('window.cdp.qsrdz')}}</label>
          <span class="">{{cutMiddleStr(address,6)}}</span>
        </div>
        <div class="cell">
          <label class="cellName">{{$t('window.cdp.gcdpCjjyid')}}</label>
          <span class="addr coin-card-copy" style="cursor: pointer;">{{cutMiddleStr(cdpTxId,6)}}</span>
        </div>
        <div class="cell">
          <label class="cellName">{{$t('window.cdp.qsl')}}</label>
          <span class="cellValue">{{scoinsToLiquidate/100000000}} WUSD</span>
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
        <button class="btn-primary" @click="sureLiquidCDP">{{$t('window.cdp.qd')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import FeesSlider from "../components/fees-slider";
import API from "../api";
import WindowMixin from "./mixin";
import CopyMixin from "../components/copy-mixin";
import formatError from "../api/format-error";
import axios from "axios";
export default {
  mixins: [WindowMixin, CopyMixin],
  components: { FeesSlider },
  data() {
    return {
      fees: 0.01,
      cdpTxId: "",
      scoinsToLiquidate: 0,
      clipboardSelector: ".coin-card-copy",
      feesName: "WICC",
      assetType: "WICC"
    };
  },
  created() {
    const query = this.$router.currentRoute.query;
    this.assetType = query.assetType;
    this.scoinsToLiquidate = query.wusdNum;
    this.cdpTxId = query.cdpTxId;
    this.callbackId = query.callbackId;
  },
  methods: {
    sureLiquidCDP() {
      this.$loading(this.$t("window.cdp.zzqsjy")); //this.$t("window.transfer.confirmLoading")

      let param = {
        assetSymbol: this.assetType,
        fees: parseFloat(this.fees) * Math.pow(10, 8),
        cdpTxId: this.cdpTxId,
        scoinsToLiquidate: this.scoinsToLiquidate,
        address: this.address,
        feeType: this.feesName
      };
      API.callRaw("cdpLiquid", { info: param }).then(
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