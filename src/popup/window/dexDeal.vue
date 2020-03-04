<template>
  <div class="main-wrapper">
    <div class="content">
      <h5 class="page-title">{{confirmType()[0]}}</h5>
      <div class="cells">
        <div class="cell">
          <label class="cellName">{{confirmType()[1]}}</label>
          <span class="cellValue" v-if="dexType === 'Limit_SELL'">{{ amount/100000000}} {{danweiStr1}}</span>
          <span class="cellValue" v-if="dexType === 'Limit_BUY'">{{ fixed(amount * price / Math.pow(10,16), 8)}} {{danweiStr1}}</span>
          <span class="cellValue" v-if="dexType === 'Market_SELL'">{{dexType.indexOf('SELL') > -1 ? amount/100000000:fixed(amount * price / Math.pow(10,16), 8)}} {{danweiStr1}}</span>
          <span class="cellValue" v-if="dexType === 'Market_BUY'">{{ amount/100000000}} {{danweiStr1}}</span>
        </div>
        <div class="cell">
          <label class="cellName">{{confirmType()[2]}}</label>
          <span
            class="cellValue"
          >{{price == $t('window.cdp.sjcjwz') ? price + ` (${danweiStr2})`: fixed(price / Math.pow(10,8), 8) + ` ${danweiStr2}`}}</span>
        </div>
        <div class="cell">
          <label class="cellName">{{confirmType()[3]}}</label>
          <span class="cellValue" v-if="dexType === 'Limit_SELL'">{{fixed(amount * price / Math.pow(10,16), 8)}} {{danweiStr3}}</span>
          <span class="cellValue" v-if="dexType === 'Limit_BUY'">{{amount/100000000}} {{danweiStr3}}</span>
          <span class="cellValue" v-if="dexType === 'Market_SELL'">{{$t('window.cdp.sjcjwz')}} ({{danweiStr3}})</span>
          <span class="cellValue" v-if="dexType === 'Market_BUY'">{{$t('window.cdp.sjcjwz')}} ({{danweiStr3}})</span>
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
        <fees-slider v-model="fees" type="dex" :feeName="feesName"></fees-slider>
      </div>
      <div class="button-wrapper">
        <button class="btn-lighter" @click="cancel">{{$t('window.cdp.qx')}}</button>
        <button class="btn-primary" @click="sure">{{$t('window.cdp.qd')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import FeesSlider from "../components/fees-slider";
import API from "../api";
import fixed from '../api/fixed'
import WindowMixin from "./mixin";
import formatError from "../api/format-error";
export default {
  mixins: [WindowMixin],
  components: { FeesSlider },
  data() {
    return {
      urlQuery: "",
      fees: 0.001,
      cdpTxId: "",
      amount: 0,
      price: 0,
      feesName: "WICC",
      dexType: "",
      assetType: "",
      coinType: "",
      danweiStr1: "",
      danweiStr2: "",
      danweiStr3: "",
      Tiles: {
        limitTitle1: [
          this.$t("window.cdp.xjmc"),
          this.$t("window.cdp.slwicc"),
          this.$t("window.cdp.jgwusd"),
          this.$t("window.cdp.hdslwusd")
        ],
        limitTitle2: [
          this.$t("window.cdp.xjmr"),
          this.$t("window.cdp.slwusd"),
          this.$t("window.cdp.jgwusd"),
          this.$t("window.cdp.hdslwicc")
        ],
        marketTitle1: [
          this.$t("window.cdp.sjmc"),
          this.$t("window.cdp.slwicc"),
          this.$t("window.cdp.dqscjg"),
          this.$t("window.cdp.yjhdwusd")
        ],
        marketTitle2: [
          this.$t("window.cdp.sjmr"),
          this.$t("window.cdp.slwusd"),
          this.$t("window.cdp.dqscjg"),
          this.$t("window.cdp.yjhdwicc")
        ]
      }
    };
  },
  created() {
    const query = this.$router.currentRoute.query;
    this.amount = query.amount;
    this.coinType = query.coinType;
    this.assetType = query.assetType;
    this.price =
      query.limitPrice == 0 ? this.$t("window.cdp.sjcjwz") : query.limitPrice;
    this.callbackId = query.callbackId;
    this.dexType = query.dealType;
    console.log(query);
  },
  methods: {
    fixed: fixed,
    ///type : 0 限价卖出，1 限价买入， 2 市价卖出，3市价买入
    confirmType() {
      if (this.dexType == "Limit_SELL") {
        this.danweiStr1 = this.assetType;
        this.danweiStr2 = this.coinType;
        this.danweiStr3 = this.coinType;
        return this.Tiles.limitTitle1;
      }
      if (this.dexType == "Limit_BUY") {
        this.danweiStr1 = this.coinType;
        this.danweiStr2 = this.coinType;
        this.danweiStr3 = this.assetType;
        return this.Tiles.limitTitle2;
      }
      if (this.dexType == "Market_SELL") {
        this.danweiStr1 = this.assetType;
        this.danweiStr2 = this.coinType;
        this.danweiStr3 = this.coinType;
        return this.Tiles.marketTitle1;
      }
      if (this.dexType == "Market_BUY") {
        this.danweiStr1 = this.coinType;
        this.danweiStr2 = this.coinType;
        this.danweiStr3 = this.assetType;
        return this.Tiles.marketTitle2;
      }
    },
    sure() {
      this.$loading(this.$t("window.cdp.dexjyz")); //this.$t("window.transfer.confirmLoading")
      //Market_BUY / Market_SELL  Limit_BUY / Limit_SELL

      if (this.dexType == "Limit_SELL") {
        ///限价卖
        let param = {
          fees: parseFloat(this.fees) * Math.pow(10, 8),
          assetAmount: this.amount,
          askPrice: this.price,
          address: this.address,
          feeType: this.feesName,
          coinType: this.coinType,
          assetType: this.assetType
        };
        this.callRaw("dexPriceSell", param);
        return;
      }
      if (this.dexType == "Limit_BUY") {
        ///限价买
        let param = {
          fees: parseFloat(this.fees) * Math.pow(10, 8),
          assetAmount: this.amount,
          bidPrice: this.price,
          address: this.address,
          feeType: this.feesName,
          coinType: this.coinType,
          assetType: this.assetType
        };
        this.callRaw("dexPriceBuy", param);
        return;
      }
      if (this.dexType == "Market_SELL") {
        ///市价卖
        let param = {
          fees: parseFloat(this.fees) * Math.pow(10, 8),
          assetAmount: this.amount,
          address: this.address,
          feeType: this.feesName,
          coinType: this.coinType,
          assetType: this.assetType
        };
        this.callRaw("dexMarketSell", param);
        return;
      }
      if (this.dexType == "Market_BUY") {
        ///市价买
        let param = {
          fees: parseFloat(this.fees) * Math.pow(10, 8),
          coinAmount: this.amount,
          address: this.address,
          feeType: this.feesName,
          coinType: this.coinType,
          assetType: this.assetType
        };
        this.callRaw("dexMarketBuy", param);
        return;
      }
    },
    callRaw(method, param) {
      API.callRaw(method, { info: param }).then(
        res => {
          console.log(res);
          this.$loading.close();
          this.$toast(res, {
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
        }
      );
    }
  }
};
</script>
<style lang="scss">
@import "./common.scss";
</style>