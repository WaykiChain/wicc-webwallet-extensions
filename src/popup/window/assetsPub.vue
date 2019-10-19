<template>
  <div class="cdp">
    <div class="content">
      <h5 class="titleHeader">{{$t('window.assets.zcfb')}}</h5>
      <div class="cell">
        <p class="cellName">{{$t('window.assets.dbjc')}}</p>
        <p class="cellValue">{{assetSymbol}}</p>
      </div>
      <div class="cell">
        <p class="cellName">{{$t('window.assets.dbqc')}}</p>
        <p class="cellValue">{{assetName}}</p>
      </div>
      <div class="cell">
        <p class="cellName">{{$t('window.assets.zfxl')}}</p>
        <p class="cellValue">{{assetSupply / Math.pow(10,8)}}</p>
      </div>
      <div class="cell">
        <p class="cellName">{{$t('window.assets.dbcyz')}}</p>
        <p class="cellValue">{{cutMiddleStr(assetOwnerId,10)}}</p>
      </div>
      <div class="cell">
        <p class="cellName">{{$t('window.assets.kfzf')}}</p>
        <p
          class="cellValue"
        >{{assetMintable == 'true' ? $t('window.assets.s') : $t('window.assets.f')}}</p>
      </div>
      <div class="cell">
        <p class="cellName">{{$t('window.assets.fwf')}}</p>
        <p class="cellValue">550 WICC</p>
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
              if (this.callbackId) {
                API.callPageCallback(this.callbackId, error, null);
              }
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
  padding-top: 40px;
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
