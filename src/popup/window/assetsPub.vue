<template>
  <div class="main-wrapper">
    <div class="content">
      <h5 class="page-title">{{$t('window.assets.zcfb')}}</h5>
      <div class="cells">
        <div class="cell">
          <label class="cellName">{{$t('window.assets.dbjc')}}</label>
          <span class="cellValue">{{assetSymbol}}</span>
        </div>
        <div class="cell">
          <label class="cellName">{{$t('window.assets.dbqc')}}</label>
          <span class="cellValue">{{assetName}}</span>
        </div>
        <div class="cell">
          <label class="cellName">{{$t('window.assets.zfxl')}}</label>
          <span class="cellValue">{{assetSupply / Math.pow(10,8)}}</span>
        </div>
        <div class="cell">
          <label class="cellName">{{$t('window.assets.dbcyz')}}</label>
          <span class="cellValue ">{{cutMiddleStr(assetOwnerId,6)}}</span>
        </div>
        <div class="cell">
          <label class="cellName">{{$t('window.assets.kfzf')}}</label>
          <span
            class="cellValue"
          >{{assetMintable == 'true' ? $t('window.assets.s') : $t('window.assets.f')}}</span>
        </div>
        <div class="cell">
          <label class="cellName">{{$t('window.assets.fwf')}}</label>
          <span class="cellValue">550 WICC</span>
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
        <button class="btn-primary" @click="sureCreateCDP">{{$t('window.cdp.qd')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import FeesSlider from "../components/fees-slider";
import API from "../api";
import WindowMixin from "./mixin";
import formatError from "../api/format-error";
export default {
  mixins: [WindowMixin],
  components: { FeesSlider },
  data() {
    return {
      urlQuery: "",
      fees: 0.01,
      assetMintable: "true",
      assetName: "",
      assetOwnerId: "",
      assetSupply: "",
      assetSymbol: "",
      callbackId: "",
      feesName: "WICC"
    };
  },
  created() {
    const query = this.$router.currentRoute.query;
    this.assetName = query.assetName;
    this.assetOwnerId = query.assetOwnerId;
    this.assetSupply = query.assetSupply;
    this.assetSymbol = query.assetSymbol;
    this.callbackId = query.callbackId;
    this.assetMintable = query.assetMintable;
    console.log(query);
  },
  methods: {
    sureCreateCDP() {
      let net = localStorage.getItem("network");
      API.getAccountInfo(net, this.assetOwnerId).then(
        res => {
          console.log("Chenggong===>", res);
          if (res.regid == "") {
            this.$toast("regid is null");
            return;
          }
          this.$loading(this.$t("window.cdp.zzfbzc")); //this.$t("window.transfer.confirmLoading")
          let param = {
            fees: parseFloat(this.fees) * Math.pow(10, 8),
            assetName: this.assetName,
            assetOwnerId: res.regid,
            assetSymbol: this.assetSymbol,
            assetMintable: this.assetMintable,
            assetSupply: parseInt(this.assetSupply),
            address: this.address,
            feesName: this.feesName
          };
          API.callRaw("assetsPub", { info: param }).then(
            res => {
              this.$loading.close();
              this.$toast(this.$t("window.transfer.createSuccess"), {
                type: "center",
                duration: 5000,
                wordWrap: true
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
                this.$t("window.transfer.createFailure") +
                  " " +
                  formatError(error),
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
        error => {
          this.$toast(this.$t("window.assets.owidError"), {
            type: "center",
            duration: 5000,
            wordWrap: true
          });
        }
      );
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