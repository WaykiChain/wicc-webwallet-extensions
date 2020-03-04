<template>
  <div class="main-wrapper">
    <div class="content">
      <h5 class="page-title">{{$t('window.assets.zcgx')}}</h5>
      <div class="cells">
        <div class="cell" style="display: block;" v-if="updateType == '2'">
          <label class="cellName">{{$t('window.assets.dbqc')}}</label>
        </div>
        <div class="cell update-direction" style="display: block;" v-if="updateType == '2'">
          <span class="cellValue">
            <span class="">{{oldAssetName}}</span>
            <span style="color: #8187A5;margin: 0 14px;">→</span>
            <span class="">{{updateContent}}</span>
          </span>
        </div>

        <div class="cell" style="display: block;" v-if="updateType == '3'">
          <label class="cellName">{{$t('window.assets.zfxl')}}</label>
        </div>
        <div class="cell update-direction" style="display: block;" v-if="updateType == '3'">
           <span class="cellValue">
            <span class="">{{oldAssetSupply}}</span>
            <span style="color: #8187A5;margin: 0 14px;">→</span>
            <span class="">{{+updateContent/Math.pow(10,8) + +oldAssetSupply}}</span>
          </span>
        </div>

        <div class="cell" style="display: block;" v-if="updateType == '1'">
          <label class="cellName">{{$t('window.assets.dbcyz')}}</label>
        </div>
        <div class="cell update-direction" style="display: block;" v-if="updateType == '1'">
          <span class="cellValue">
            <span class="">{{cutMiddleStr(oldAssetOwnerId,6)}}</span>
            <span style="color: #8187A5;margin: 0 14px;">→</span>
            <span class="">{{cutMiddleStr(updateContent,6)}}</span>
          </span>
        </div>

        <div class="cell">
          <label class="cellName">{{$t('window.assets.dbjc')}}</label>
          <span class="cellValue deeper">{{assetSymbol}}</span>
        </div>
        <div class="cell">
          <label class="cellName">
            {{$t('window.assets.dbqc')}}
            <span
              v-if="updateType == '2'"
            >({{$t('window.assets.n')}})</span>
          </label>
          <span class="cellValue">{{updateType == '2' ? updateContent : oldAssetName}}</span>
        </div>
        <div class="cell">
          <label>
            {{$t('window.assets.zfxl')}}
            <span
              v-if="updateType == '3'"
            >({{$t('window.assets.n')}})</span>
          </label>
          <span
            class="cellValue"
          >{{updateType == '3' ? +updateContent/Math.pow(10,8) + +oldAssetSupply :oldAssetSupply}}</span>
        </div>
        <div class="cell">
          <label class="cellName">
            {{$t('window.assets.dbcyz')}}
            <span
              v-if="updateType == '1'"
            >({{$t('window.assets.n')}})</span>
          </label>
          <span
            class=""
          >{{updateType == '1' ? cutMiddleStr(updateContent,6):cutMiddleStr(oldAssetOwnerId,6)}}</span>
        </div>
        <div class="cell">
          <label class="cellName">{{$t('window.assets.fwf')}}</label>
          <span class="cellValue">110 WICC</span>
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
      updateType: "", //1资产拥有者 2资产名称 3 资产发行量
      oldAssetName: "",
      oldAssetOwnerId: "",
      oldAssetSupply: "1000000000",
      updateContent: "",
      assetSymbol: "",
      callbackId: "",
      feesName: "WICC",
      newOwnerID: ""
    };
  },
  created() {
    const query = this.$router.currentRoute.query;
    this.updateContent = query.updateContent;

    this.assetSymbol = query.assetSymbol;
    this.callbackId = query.callbackId;
    this.updateType = query.updateType;
    this.getOldAssets();
    console.log(query);
  },
  methods: {
    sureCreateCDP() {
      if (this.updateType == "1") {
        if (this.newOwnerID == "") {
          this.$toast(this.$t("window.assets.owidError"), {
            type: "center",
            duration: 1000,
            wordWrap: true
          });
          return;
        }
      }
      this.$loading(this.$t("window.cdp.updateAssets")); //this.$t("window.transfer.confirmLoading")
      let param = {
        fees: parseFloat(this.fees) * Math.pow(10, 8),
        updateContent:
          this.updateType == "1" ? this.newOwnerID : this.updateContent,
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
          // if (this.callbackId) {
          //   API.callPageCallback(this.callbackId, error, null);
          // }
        }
      );
    },
    getOldAssets() {
      // this.$loading(this.$t("window.cdp.hqzcz")); //this.$t("window.transfer.confirmLoading")
      let param = {
        assetSymbol: this.assetSymbol
      };
      API.callRaw("getAssetInfo", { info: param }).then(
        res => {
          // this.$loading.close();
          this.oldAssetName = res.assetname;
          this.oldAssetOwnerId = res.owneraddr;
          this.oldAssetSupply = res.totalsupply / Math.pow(10, 8);
        },
        error => {
          this.$toast(error.message, {
            type: "center",
            duration: 5000,
            wordWrap: true
          });
          this.$loading.close();
        }
      );
      if (this.updateType == "1") {
        let net = localStorage.getItem("network");
        API.getAccountInfo(net, this.updateContent).then(
          res => {
            if (!res.regid) {
              this.$toast("Wallet not Active");
              this.newOwnerID == "";
              return;
            }
            this.newOwnerID = res.regid;
          },
          error => {
            this.$toast(this.$t("window.assets.owidError"), {
              type: "center",
              duration: 5000,
              wordWrap: true
            });
            this.$loading.close();
          }
        );
      }
    }
  }
};
</script>
</script>
<style lang="scss">
@import "./common.scss";
.main-wrapper {
  .update-direction {
    height: 54px;
    background-color: #f5f7fa;
    border-radius: 6px;
    margin-top: -8px;
    .cellValue {
      display: flex;
      width: 100%;
      height: 100%;
      max-width: 100%;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
    }
  }
}
</style>