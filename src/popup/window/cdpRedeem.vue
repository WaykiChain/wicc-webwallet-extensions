<template>
  <div class="cdp">
    <div class="content">
      <h5 class="titleHeader">{{$t('window.cdp.cdpshjy')}}</h5>
      <div class="cell">
        <p class="cellName">{{$t('window.cdp.cjcdpdz')}}</p>
        <p class="cellValue">{{cutMiddleStr(address,8)}}</p>
      </div>
      <div class="cell">
        <p class="cellName">{{$t('window.cdp.gcdpCjjyid')}}</p>
        <p class="cellValue" style="padding-right:20px;">{{cutMiddleStr(cdpTxId,7)}}
          <span class="copy coin-card-copy">
            <img src="../static/copy.svg" alt />
          </span>
        </p>
      </div>
      <div class="cell">
        <p class="cellName">{{$t('window.cdp.ghl')}}</p>
        <p class="cellValue">{{scoins_to_repay/100000000}} WUSD</p>
      </div>
      <div class="cell">
        <p class="cellName">{{$t('window.cdp.shl')}}</p>
        <p class="cellValue">{{bcoins_to_redeem/100000000}} {{bcoins_symbol}}</p>
      </div>
      <div class="bar"></div>
    </div>

    <div class="feesView">
      <select class="feesName" name="WICC" id="" v-model="feesName">
        <option value="WICC">WICC</option>
        <option value="WUSD">WUSD</option>
      </select>
      <fees-slider v-model="fees" type="call-cdp" :feeName="feesName"></fees-slider>
    </div>
    <div class="bottom_btn">
      <div class="btn" @click="cancel">{{$t('window.cdp.qx')}}</div>
      <div class="btn sure" @click="sureRedeemCDP">{{$t('window.cdp.qd')}}</div>
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
  mixins: [WindowMixin,CopyMixin],
  components: { FeesSlider },
  data() {
    return {
      urlQuery: "",
      fees: 0.001,
      cdpTxId: "",
      scoins_to_repay: 0,
      bcoins_to_redeem:0,
      clipboardSelector: ".coin-card-copy",
      feesName:'WICC',
      bcoins_symbol:'WICC',
    };
  },
  created() {
    const query = this.$router.currentRoute.query;
    this.bcoins_to_redeem = query.wiccNum;
    this.bcoins_symbol = query.redeemSymbol
    this.scoins_to_repay = query.wusdNum;
    this.cdpTxId = query.cdpTxId;
    this.callbackId = query.callbackId;
  },
  methods: {
    sureRedeemCDP() {
      this.$loading('正在赎回交易');//this.$t("window.transfer.confirmLoading")

      let param = {
       
        fees: parseFloat(this.fees) * Math.pow(10, 8),
        cdpTxId: this.cdpTxId,
        bcoins_symbol:this.bcoins_symbol,
        scoins_to_repay: this.scoins_to_repay,
        bcoins_to_redeem: this.bcoins_to_redeem,
        address: this.address,
        feeType:this.feesName,
      };
      API.callRaw("cdpRedeem", { info: param }).then(res => {
          console.log(res)
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
          if (this.callbackId) {
            API.callPageCallback(this.callbackId, error, null);
          }
        });
      },
      getCopyText () {
        return this.cdpTxId
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
    position: relative;
    .copy {
     position: absolute;
     top: 0px;
     right: 0px;
     width: 14px;
     cursor: pointer;
    }
  }
}
.feesView {
  padding-top: 47px;
  position: relative;
  .feesName{
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
</style>
