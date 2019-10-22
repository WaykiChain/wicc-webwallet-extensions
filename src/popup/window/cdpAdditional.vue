<template>
  <div class="cdp">
    <div class="content">
      <h5 class="titleHeader">{{$t('window.cdp.cdpzjjy')}}</h5>
      <div class="cell">
        <p class="cellName">{{$t('window.cdp.cjcdpdz')}}</p>
        <p class="cellValue">{{cutMiddleStr(address,8)}}</p>
      </div>
      <div class="cell">
        <p class="cellName">{{$t('window.cdp.gcdpCjjyid')}}</p>
        <p class="cellValue" style="padding-right:20px;">
          {{cutMiddleStr(cdpTxId,7)}}
          <span class="copy coin-card-copy">
            <img src="../static/copy.svg" alt />
          </span>
        </p>
      </div>
      <div class="cell">
        <p class="cellName">{{$t('window.cdp.zjdyl')}}</p>
        <p class="cellValue">{{bcoinsToStake/100000000}} {{bcoinSymbol}}</p>
      </div>
      <div class="cell">
        <p class="cellName">{{$t('window.cdp.zjdcl')}}</p>
        <p class="cellValue">{{scoinsToMint/100000000}} {{scoinSymbol}}</p>
      </div>
      <div class="bar"></div>
    </div>

    <div class="feesView">
      <select class="feesName" name="WICC" id v-model="feesName">
        <option value="WICC">WICC</option>
        <option value="WUSD">WUSD</option>
      </select>
      <fees-slider v-model="fees" type="call-cdp" :feeName="feesName"></fees-slider>
    </div>
    <div class="bottom_btn">
      <div class="btn" @click="cancel">{{$t('window.cdp.qx')}}</div>
      <div class="btn sure" @click="sureCreateCDP">{{$t('window.cdp.qd')}}</div>
    </div>
  </div>
</template>
<script>
import FeesSlider from "../components/fees-slider";
import API from "../api";
import WindowMixin from "./mixin";
import CopyMixin from "../components/copy-mixin";
import formatError from "../api/format-error";
export default {
  mixins: [CopyMixin, WindowMixin],
  components: { FeesSlider },
  data() {
    return {
      urlQuery: "",
      fees: 0.01,
      cdpTxId: "",
      bcoinsToStake: 0,
      scoinsToMint: 0,
      clipboardSelector: ".coin-card-copy",
      feesName: "WICC"
    };
  },
  created() {
    const query = this.$router.currentRoute.query;
    this.bcoinsToStake = query.wiccNum;
    this.scoinsToMint = query.wusdNum;
    this.bcoinSymbol = query.bcoinSymbol;
    this.scoinSymbol = query.scoinSymbol;
    this.cdpTxId = query.cdpTxId;
    this.callbackId = query.callbackId;
    console.log(query)
  },
  methods: {
    sureCreateCDP() {
      this.$loading(this.$t("window.cdp.zzzjjy")); //this.$t("window.transfer.confirmLoading")
      let param = {
        fees: parseFloat(this.fees) * Math.pow(10, 8),
        cdpTxId: this.cdpTxId,
        bcoinsToStake: this.bcoinsToStake,
        scoinsToMint: this.scoinsToMint,
        address: this.address,
        feeType: this.feesName
      };
      API.callRaw("cdpStake", { info: param }).then(
        res => {
          console.log(res);
          this.$loading.close();
          this.$t("window.transfer.createSuccess"),
            {
              type: "center",
              duration: 5000,
              wordWrap: true
            };
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
          console.log(error);
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
    box-sizing: border-box;
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
</style>
