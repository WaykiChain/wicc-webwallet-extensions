<template>
  <vodal class="view-mnemonic-dialog" :show="visible" animation="zoom" @hide="onHide" :width="300">
    <div class="dialog-title">{{ $t('account.dialog.viewMnemonicTitle') }}</div>
    <password :warn-txt="$t('account.dialog.viewMnemonicTip')" @on-cancel="onHide" @on-confirm="onConfirm"></password>
    <div class="info-content" v-if="showInfoContent">
      <wallet-input
        v-model="mnemonic"
        style="margin-bottom:14px;"
        label="请妥善保存助记词"
        type="textarea"
        read-only
      ></wallet-input>
      <div class="jump" @click="switchCode">
        <span class="circle" :class="{isRefreshing: isRefreshing}"></span>
        <span>Switch {{currentLang === "CHINESE" ? "English" : "Chinese"}} Mnemonic</span>
      </div>
      <div class="btn-wrapper">
        <button
          class="btn-lighter"
          @click="download"
        >{{ $t('account.dialog.downloadMnemonicButton') }}</button>
        <button class="btn-primary coin-card-copy">{{ $t('account.dialog.copyMnemonicButton') }}</button>
      </div>
    </div>
  </vodal>
</template>

<script>
import WalletInput from "../../components/input";
import API from "../../api/index";
import download from "../../api/download";
import DialogMixin from "./dialog-mixin";
import WiccApi from "../../../backend/wallet/wicc-api";
import CopyMixin from "../../components/copy-mixin";
import Password from "./password";

export default {
  name: "view-mnemonic",

  mixins: [DialogMixin, CopyMixin],

  components: {
    WalletInput,
    Password
  },

  props: {
    network: {
      type: String,
      required: true
    },

    address: {
      type: String,
      required: true
    }
  },

  mounted() {},

  methods: {
    download() {
      download("wicc-seed.txt", this.mnemonic);
    },
    getCopyText() {
      return this.mnemonic;
    },
    switchCode() {
      if (this.isRefreshing) return;
      this.isRefreshing = true;
      setTimeout(() => {
        this.isRefreshing = false;
      }, 600);
      if (this.currentLang === "ENGLISH") {
        this.mnemonic = this.wiccApi.switchMnemonicCode(
          this.mnemonic,
          "CHINESE"
        );
        this.currentLang = "CHINESE";
      } else {
        this.mnemonic = this.wiccApi.switchMnemonicCode(
          this.mnemonic,
          "ENGLISH"
        );
        this.currentLang = "ENGLISH";
      }
    },
    onConfirm() {
      this.showInfoContent = true
      this.$loading(this.$t("common.loading"));

      setTimeout(() => {
        API.getMnemonic(this.network, this.address).then(
          value => {
            this.mnemonic = value;
            this.$loading.close();
            this.wiccApi = new WiccApi();
            this.currentLang = this.wiccApi.getMnemonicCodeLanguage(
              this.mnemonic
            );
          },
          () => {
            this.$loading.close();
          }
        );
      }, 300);
    }
  },

  data() {
    return {
      mnemonic: null,
      currentLang: "",
      isRefreshing: false,
      clipboardSelector: ".coin-card-copy",
      showInfoContent: false
    };
  }
};
</script>

<style lang="scss" scoped>
.dialog-title {
  text-align: center;
  font-size: 16px;
  color: #21274a;
  line-height: 22px;
  font-weight: 500;
  margin-bottom: 16px;
}

.btn-primary {
  width: 160px;
}

.btn-wrapper {
  text-align: center;
  display: flex;
  justify-content: space-between;
  button {
    margin: 0;
    padding: 0;
    width: 124px;
  }
}
.jump {
  display: flex;
  align-items: center;
  height: 18px;
  font-size: 13px;
  color: #062deb;
  margin-bottom: 24px;
  cursor: pointer;
  .circle {
    width: 14px;
    height: 14px;
    background: url("../../static/switch.svg");
    margin-right: 8px;
    &.isRefreshing {
      transform: rotate(360deg);
      transition: all 500ms linear;
    }
  }
}
</style>