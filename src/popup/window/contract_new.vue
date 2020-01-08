<template>
  <div class="main-wrapper">
    <div class="content">
      <h5 class="page-title">{{$t('window.contract.title')}}</h5>
      <div class="value-block">
        <div class="value">-{{amount/100000000}} {{coinSymbol}}</div>
      </div>
      <div class="cells">
        <div class="cell">
          <label class="cellName">{{$t('window.contract.addressLabel')}}</label>
          <span class="">{{address ? cutMiddleStr(address,6) : ""}}</span>
        </div>
        <div class="cell">
          <label class="cellName">{{$t('window.contract.contractRegIdLabel')}}</label>
          <span class="cellValue">{{regId}}</span>
        </div>
        <div class="cell">
          <label class="cellName">{{$t('window.contract.contractLabel')}}</label>
          <span class="cellValue">{{contract}}</span>
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
      feesName: "WICC",
      amount: 0,
      regId: 0,
      coinSymbol: "",
      contract: "",
      memo: "Message",
      onlyRaw: ""
    };
  },
  created() {
    const query = this.$router.currentRoute.query;
    this.amount = query.amount;
    this.regId = query.regId;
    this.coinSymbol = query.coinSymbol;
    // if (query.coinSymbol == "WUSD") {
    //   this.feesName = "WUSD";
    // } else {
    //   this.feesName = "WICC";
    // }
    this.contract = query.contract;
    this.memo = query.memo;
    this.callbackId = query.callbackId;
    this.onlyRaw = query.onlyRaw;
    console.log(query);
  },
  methods: {
    sureCreateCDP() {
      this.$loading(this.$t("window.cdp.zzcjjy")); //this.$t("window.transfer.confirmLoading")
      let param = {
        fees: parseFloat(this.fees) * Math.pow(10, 8),
        amount: this.amount,
        regId: this.regId,
        coinSymbol: this.coinSymbol,
        address: this.address,
        feesName: this.feesName,
        contract: this.contract,
        memo: this.memo
      };
      if (this.onlyRaw == "1") {
        this.call("variousCoinsContractRaw", param);
      } else {
        this.call("variousCoinsContractTx", param);
      }
    },
    call(name, param) {
      API.callRaw(name, { info: param }).then(
        res => {
          console.log(res);
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
