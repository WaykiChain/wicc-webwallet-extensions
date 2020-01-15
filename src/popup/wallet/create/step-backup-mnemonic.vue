<template>
  <nav-layout back-type="close" :path="backPath" class="u-full-height">
    <div class="title">{{$t('wallet.create.backup.title')}}</div>
    <div class="sub-title">{{$t('wallet.create.backup.mnemonicLabel')}}</div>
    <div class="mnemonic-word" style="margin-bottom:16px;">{{mnemonic}}</div>

    <template>
      <div class="jump" @click="switchCode">
        <span class="circle" :class="{isRefreshing: isRefreshing}"></span>
        <span>{{$t('wallet.create.Switch')}}{{currentLang === "CHINESE" ? $t('wallet.create.English') : $t('wallet.create.CHINESE')}}{{$t('wallet.create.Mnemonic')}}</span>
      </div>
      <button
        class="display-block btn-primary"
        @click="validateWalletMnemonic"
      >{{ $t('wallet.create.backup.nextButton') }}</button>
      <button
        class="display-block btn-lighter"
        @click="download"
      >{{ $t('wallet.create.backup.downloadButton') }}</button>
    </template>
    <warning :text="$t('wallet.create.backup.tip')"></warning>
  </nav-layout>
</template>

<style scoped>
@import "../warning.scss";
.sub-title {
  color: #8187A5;
  line-height: 20px;
  margin-bottom: 6px;
  font-size: 13px;
}
</style>

<script type="text/jsx">
import WalletInput from "../../components/input";
import NavLayout from "../../components/nav-layout";
import download from "../../api/download";
import eventBus from "../../account/bus";
import Warning from "../../components/warning";
import WiccApi from "../../../backend/wallet/wicc-api";

export default {
  name: "backup-mnemonic",

  components: {
    NavLayout,
    WalletInput,
    Warning
  },
  created() {
    const route = this.$router.currentRoute;
    const { password } = route.query;
    if (password) {
      this.password = password;
    }

    if (route && route.path) {
      this.isCreatingWallet = route.path.indexOf("wallet") !== -1;
    }

    this.wiccApi = new WiccApi();
    this.currentLang = this.wiccApi.getMnemonicCodeLanguage(this.mnemonic);
  },

  computed: {
    backPath() {
      if (this.isCreatingWallet) {
        return {
          name: "createWallet"
        };
      } else {
        return {
          name: "welcome"
        };
      }
    }
  },

  methods: {
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

    validateWalletMnemonic() {
      if (this.isCreatingWallet) {
        this.$router.push({
          name: "validateWalletMnemonic",
          query: {
            mnemonic: this.mnemonic,
            password: this.password
          }
        });
      } else {
        this.$router.push({
          name: "validateAccountMnemonic",
          query: {
            mnemonic: this.mnemonic
          }
        });
      }
    },

    download() {
      download("WICC-Mnemonic.txt", this.mnemonic);
    }
  },

  data() {
    return {
      isCreatingWallet: true,
      mnemonic: this.$route.query.mnemonic,
      password: null,
      currentLang: "",
      wiccApi: null,
      isRefreshing: false
    };
  }
};
</script>
<style lang="scss" scoped>
.jump {
  display: flex;
  align-items: center;
  height: 18px;
  font-size: 13px;
  color: #062deb;
  margin-bottom: 50px;
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
.mnemonic-word {
  background: #f5f7fa;
  padding: 14px;
  padding-bottom: 22px;
  line-height: 20px;
  border-radius: 6px;
  font-size: 15px;
  color: #21294A;
  min-height: 76px;
  box-sizing: border-box;
}
.title {
  font-size: 20px;
  color: #21274a;
  line-height: 28px;
  font-weight: 500;
  margin-bottom: 36px;
}
</style>
