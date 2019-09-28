<template>
  <div class="cdp">
    <div class="content">
      <h5 class="titleHeader">{{$t('window.assets.zcgx')}}</h5>
      <div class="cell" style="display: block;" v-if="updateType == '2'">
        <p class="cellName">{{$t('window.assets.dbqc')}}</p>
        <p class="cellValue">
          {{oldAssetName}} →
          <span style="color:#3C78EA">{{updateContent}}</span>
        </p>
      </div>
      <div class="cell" style="display: block;" v-if="updateType == '3'">
        <p class="cellName">{{$t('window.assets.zfxl')}}</p>
        <p class="cellValue">
          {{oldAssetSupply}} +
          <span style="color:#3C78EA">{{updateContent}}</span>
        </p>
      </div>
      <div class="cell" style="display: block;" v-if="updateType == '1'">
        <p class="cellName">{{$t('window.assets.dbcyz')}}</p>
        <p class="cellValue">
          {{oldAssetOwnerId}} →
          <span style="color:#3C78EA">{{updateContent}}</span>
        </p>
      </div>
      <div class="cell">
        <p class="cellName">{{$t('window.assets.dbjc')}}</p>
        <p class="cellValue">{{assetSymbol}}</p>
      </div>
      <div class="cell">
        <p class="cellName">
          {{$t('window.assets.dbqc')}}
          <span v-if="updateType == '2'" style="color:#3C78EA">({{$t('window.assets.n')}})</span>
        </p>
        <p class="cellValue">{{updateType == '2' ? updateContent : oldAssetName}}</p>
      </div>
      <div class="cell">
        <p class="cellName">
          {{$t('window.assets.zfxl')}}
          <span v-if="updateType == '3'" style="color:#3C78EA">({{$t('window.assets.n')}})</span>
        </p>
        <p class="cellValue">{{updateType == '3' ? parseInt(updateContent)+parseInt(oldAssetSupply) :oldAssetSupply}}</p>
      </div>
      <div class="cell">
        <p class="cellName">
          {{$t('window.assets.dbcyz')}}
          <span v-if="updateType == '1'" style="color:#3C78EA">({{$t('window.assets.n')}})</span>
        </p>
        <p
          class="cellValue"
        >{{updateType == '1' ? updateContent : oldAssetOwnerId}}</p>
      </div>
      <div class="cell">
        <p class="cellName">{{$t('window.assets.fwf')}}</p>
        <p class="cellValue">110 WICC</p>
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
      updateType: "", //1资产拥有者 2资产名称 3 资产发行量
      oldAssetName: "",
      oldAssetOwnerId:
        "",
      oldAssetSupply: "",
      updateContent: "",
      assetSymbol: "",
      callbackId: "",
      feesName: "WICC"
    };
  },
  created() {
    const query = this.$router.currentRoute.query;
    this.updateContent = query.updateContent;

    this.assetSymbol = query.assetSymbol;
    this.callbackId = query.callbackId;
    this.updateType = query.updateType;
    this.getOldAssets()
    console.log(query);
  },
  methods: {
    sureCreateCDP() {
      this.$loading(this.$t("window.cdp.updateAssets")); //this.$t("window.transfer.confirmLoading")
      let param = {
        fees: parseFloat(this.fees) * Math.pow(10, 8),
        updateContent: this.updateContent,
        assetSymbol: this.assetSymbol,
        updateType: this.updateType,
        address: this.address,
        feesName: this.feesName
      };
      API.callRaw("assetsUpdate", { info: param }).then(
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
          if (this.callbackId) {
            API.callPageCallback(this.callbackId, error, null);
          }
        }
      );
    },
    getOldAssets() {
      this.$loading(this.$t("window.cdp.hqzcz")); //this.$t("window.transfer.confirmLoading")
      let param = {
        assetSymbol: this.assetSymbol
      };
      API.callRaw("getAssetInfo", { info: param }).then(
        res => {
          console.log(res);
          this.$loading.close();
          this.oldAssetName = res.assetname
          this.oldAssetOwnerId = res.owneraddr
          this.oldAssetSupply = res.totalsupply / Math.pow(10,8)
        },
        error => {
          this.$loading.close();
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
  height: 443px;
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
  padding: 15px 16px;
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
    line-height: 27px;
  }
  .cellValue {
    color: #5b5f67;
    font-size: 13px;
    line-height: 27px;
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
