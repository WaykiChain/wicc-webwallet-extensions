<template>
  <div class="main-wrapper">
    <div class="content">
      <h5 class="page-title">{{$t('window.cdp.qxjy')}}</h5>
      <div class="cells">
        <div class="cell">
          <label class="cellName">{{$t('account.transDetail.hashLabel')}}</label>
          <span class="" style="cursor: pointer;">{{cutMiddleStr(dealNum,12)}}</span>
        </div>
        <div class="line"></div>
        <div class="cell">
          <label class="cellName">{{$t('window.cdp.lx')}}</label>
          <span class="cellValue">{{formatNewTxType(dexType)}}</span>
        </div>
        <div class="cell">
          <label class="cellName">{{dexType == "" ? '' : confirmType(dexType)[1]}}</label>
          <span class="cellValue">{{dexType.indexOf('SELL') > -1 ? wiccNum : fixed(price !== $t("window.cdp.sjcjwz") ? wiccNum * price : wiccNum, 8)}} {{danweiStr1}}</span>
        </div>
        <div class="cell">
          <label class="cellName">{{dexType == "" ? '' : confirmType(dexType)[2]}}</label>
          <span class="cellValue" v-if="price == $t('window.cdp.sjcjwz')">{{price}} ({{danweiStr2}})</span>
          <span class="cellValue" v-else>{{price}} {{danweiStr2}}</span>
        </div>
        <div v-if="dexType.indexOf('MARKET')==-1" class="cell">
          <label class="cellName">{{dexType == "" ? '' : confirmType(dexType)[3]}}</label>
          <span
            class="cellValue"
            v-if="dexType.indexOf('SELL') > -1"
          >{{dexType.indexOf('Market') > -1 ? $t('window.cdp.sjcjwz') + ' (' + danweiStr3 +')' : fixed(wiccNum * price, 8) + ' ' + danweiStr3}}</span>
          <span class="cellValue" v-else>{{ wiccNum }} {{danweiStr3}}</span>
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
import transUtil from "../account/components/trans-util";
import CopyMixin from "../components/copy-mixin";
import FeesSlider from "../components/fees-slider";
import API from "../api";
import fixed from '../api/fixed'
import WindowMixin from "./mixin";
import formatError from "../api/format-error";
export default {
  mixins: [WindowMixin, CopyMixin],
  components: { FeesSlider },
  data() {
    return {
      urlQuery: "",
      fees: 0.001,
      cdpTxId: "",
      wiccNum: 0,
      wusdNum: 0,
      price: 0,
      feesName: "WICC",
      dexType: "",
      dealNum: "",
      clipboardSelector: ".coin-card-copy",
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
  ///type : 0 限价卖出，1 限价买入， 2 市价卖出，3市价买入
  created() {
    const query = this.$router.currentRoute.query;
    this.callbackId = query.callbackId;
    this.dealNum = query.dealNum;
    console.log(query);
    this.getDetailInfo();
  },
  methods: {
    formatNewTxType: transUtil.formatNewTxType,
    fixed: fixed,
    confirmType(dexType) {
      if (dexType == "DEX_LIMIT_SELL_ORDER_TX") {
        this.danweiStr1 = this.assetType;
        this.danweiStr2 = this.coinType;
        this.danweiStr3 = this.coinType;
        return this.Tiles.limitTitle1;
      }
      if (dexType == "DEX_LIMIT_BUY_ORDER_TX") {
        this.danweiStr1 = this.coinType;
        this.danweiStr2 = this.coinType;
        this.danweiStr3 = this.assetType;
        return this.Tiles.limitTitle2;
      }
      if (dexType == "DEX_MARKET_SELL_ORDER_TX") {
        this.danweiStr1 = this.assetType;
        this.danweiStr2 = this.coinType;
        this.danweiStr3 = this.coinType;
        return this.Tiles.marketTitle1;
      }
      if (dexType == "DEX_MARKET_BUY_ORDER_TX") {
        this.danweiStr1 = this.coinType;
        this.danweiStr2 = this.coinType;
        this.danweiStr3 = this.assetType;
        return this.Tiles.marketTitle2;
      }
    },
    sure() {
      this.$loading(this.$t("window.cdp.zzqxjy")); //this.$t("window.transfer.confirmLoading")

      let param = {
        fees: parseFloat(this.fees) * Math.pow(10, 8),
        orderId: this.dealNum,
        address: this.address,
        feeType: this.feesName
      };
      this.callRaw("dexCancel", param);
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
    },

    getDetailInfo() {
      let param = {
        hash: this.dealNum
      };
      API.callRaw("getDetailInfo", { info: param }).then(
        res => {
          console.log(res);
          this.dexType = res.txtype;
          this.price = res.price
            ? res.price / 100000000
            : this.$t("window.cdp.sjcjwz");
          this.wiccNum = res.assetamount
            ? res.assetamount / 100000000
            : res.coinamount / 100000000;
          this.assetType = res.assetsymbol;
          this.coinType = res.coinsymbol;
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
    },

    getCopyText() {
      return this.dealNum;
    }
  }
};
</script>
<style lang="scss">
@import "./common.scss";
.main-wrapper {
  .line {
    border-bottom: 1px solid #F0F3F7;
    margin-top: 24px;
    margin-bottom: 24px;
  }
}
</style>
