<template>
  <div class="cdp">
    <div class="content">
      <h5 class="titleHeader">{{confirmType()[0]}}</h5>
      <div class="cell">
        <p class="cellName">{{confirmType()[1]}}({{danweiStr1}}):</p>
        <p class="cellValue">{{amount/100000000}} </p>
      </div>
      <div class="cell">
        <p class="cellName">{{confirmType()[2]}}({{danweiStr2}}):</p>
        <p class="cellValue">{{price == $t('window.cdp.sjcjwz') ? price : price / Math.pow(10,8)}}</p>
      </div>
      <div class="cell">
        <p class="cellName">{{confirmType()[3]}}({{danweiStr3}}):</p>
        <p class="cellValue">{{dexType.indexOf('Market') > -1 ? $t('window.cdp.sjcjwz') : (amount * price / Math.pow(10,16)).toFixed(2)}}</p>
      </div>
      <p v-if="dexType.indexOf('Market') > -1" class="tips">{{ dexType == "Market_SELL" ? $t('window.cdp.tipsmc') : $t('window.cdp.tipsmr')}}</p>
      <div class="bar"></div>
    </div>

    <div class="feesView">
      <select class="feesName" name="WICC" id v-model="feesName">
        <option value="WICC">WICC</option>
        <option value="WUSD">WUSD</option>
      </select>
      <fees-slider v-model="fees" type="dex" :feeName="feesName"></fees-slider>
    </div>
    <div class="bottom_btn">
      <div class="btn" @click="cancel">{{$t('window.cdp.qx')}}</div>
      <div class="btn sure" @click="sure">{{$t('window.cdp.qd')}}</div>
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
      fees: 0.0001,
      cdpTxId: "",
      amount: 0,
      price: 0,
      feesName: "WICC",
      dexType: "",
      assetType:"",
      coinType:"",
      danweiStr1:"",
      danweiStr2:"",
      danweiStr3:"",
      Tiles: {
        limitTitle1: [
          this.$t('window.cdp.xjmc'),
          this.$t('window.cdp.slwicc'),
          this.$t('window.cdp.jgwusd'),
          this.$t('window.cdp.hdslwusd'),
        ],
        limitTitle2: [
          this.$t('window.cdp.xjmr'),
          this.$t('window.cdp.slwusd'),
          this.$t('window.cdp.jgwusd'),
          this.$t('window.cdp.hdslwicc'),
        ],
        marketTitle1: [
          this.$t('window.cdp.sjmc'),
          this.$t('window.cdp.slwicc'),
          this.$t('window.cdp.dqscjg'),
          this.$t('window.cdp.yjhdwusd'),
        ],
        marketTitle2: [
          this.$t('window.cdp.sjmr'),
          this.$t('window.cdp.slwusd'),
          this.$t('window.cdp.dqscjg'),
          this.$t('window.cdp.yjhdwicc'),
        ]
      }
    };
  },
  created() {
    const query = this.$router.currentRoute.query;
    this.amount = query.amount;
    this.coinType = query.coinType;
    this.assetType = query.assetType;
    this.price = query.limitPrice==0 ? '以实际为准' : query.limitPrice;
    this.callbackId = query.callbackId;
    this.dexType = query.dealType;
    console.log(query);
  },
  methods: {
    ///type : 0 限价卖出，1 限价买入， 2 市价卖出，3市价买入
    confirmType() {
      if (this.dexType == "Limit_SELL") {
        this.danweiStr1 = this.assetType
        this.danweiStr2 = this.coinType
        this.danweiStr3 = this.coinType
        return this.Tiles.limitTitle1;
      }
      if (this.dexType == "Limit_BUY") {
        this.danweiStr1 = this.assetType
        this.danweiStr2 = this.coinType
        this.danweiStr3 = this.coinType
        return this.Tiles.limitTitle2;
      }
      if (this.dexType == "Market_SELL") {
        this.danweiStr1 = this.assetType
        this.danweiStr2 = this.coinType
        this.danweiStr3 = this.coinType
        return this.Tiles.marketTitle1;
      }
      if (this.dexType == "Market_BUY") {
        this.danweiStr1 = this.coinType
        this.danweiStr2 = this.coinType
        this.danweiStr3 = this.coinType
        return this.Tiles.marketTitle2;
      }
    },
    sure() {
      this.$loading("正在创建交易"); //this.$t("window.transfer.confirmLoading")
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
          assetType: this.assetType,
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
          assetType: this.assetType,
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
          assetType: this.assetType,
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
          assetType: this.assetType,
        };
        this.callRaw("dexMarketBuy", param);
        return;
      }
    },
    callRaw(method, param) {
      debugger
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
<style lang="scss" scoped>
.cdp {
  .titleHeader {
    line-height: 64px;
    text-align: center;
    border-bottom: 1px solid rgba($color: #b4bccc, $alpha: 0.3);
    font-size: 18px;
    margin-bottom: 0;
  }
  p {
    margin-bottom: 0;
    line-height: 18px;
  }
}
.content {
  height: 447px;
  position: relative;
  .bar {
    position: absolute;
    height: 10px;
    bottom: 0;
    width: 100%;
    background: #f2f5fc;
  }
}
.cell {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 20px 16px;
  &:after {
    content: " ";
    width: calc(100% - 32px);
    height: 1px;
    background: rgba($color: #b4bccc, $alpha: 0.3);
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%); //居中处理
  }
  .cellName {
    color: #b4bccc;
    font-size: 13px;
  }
  .cellValue {
    color: #5b5f67;
    font-size: 13px;
  }
}
.feesView {
  padding-top: 47px;
  position: relative;
  .feesName {
    border: none;
    position: absolute;
    top: 10px;
    right: 20px;
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
.tips{
  padding: 16px;
  color: #B4BCCC;
  font-size: 12px;
}
</style>
