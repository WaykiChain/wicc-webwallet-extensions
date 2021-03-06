<template>
  <nav-layout footer-padding="60" back-type="close" class="u-full-height set-password">
    <div class="title">{{$t('wallet.import.title')}}</div>
     <div class="import-w">
      <span style="color:#8187A5;">{{$t('splash.noWallet')}}?</span>
      <span @click="gotoImportWallet">{{ $t('splash.createWalletButton') }}</span>
    </div>
    <wallet-input
      v-model="mnemonic"
      :label="$t('wallet.import.mnemonic')"
      :placeholder="$t('wallet.import.mnemonicPlaceholder')"
      type="textarea"
      style="margin-bottom: 24px;"
      @change="setChange"
    ></wallet-input>

    <wallet-input
      v-model="password"
      :label="$t('wallet.import.password')"
      :placeholder="$t('wallet.import.passwordPlaceholder')"
      type="password"
      style="margin-bottom: 24px;"
      @change="changeHandler1"
      @input="inputHandler1"
      :message="error1"
      :pattern="/^\S{0,}$/"
    ></wallet-input>

    <wallet-input
      v-model="password2"
      :label="$t('wallet.import.password2')"
      :placeholder="$t('wallet.import.password2Placeholder')"
      type="password"
      style="margin-bottom: 0;"
      @change="changeHandler2"
      @input="inputHandler2"
      :message="error2"
      :pattern="/^\S{0,}$/"
    ></wallet-input>

    <template slot="footer">
      <button
        class="display-block btn-primary"
        :disabled="!isCompleted"
        @click="importWallet"
      >{{ $t('common.confirm') }}</button>
    </template>
    <warning :text="$t('wallet.import.tip')"></warning>
  </nav-layout>
</template>

<script>
import WalletInput from "../components/input";
import API from "../api";
import NavLayout from "../components/nav-layout";
import formatError from "../api/format-error";
import Warning from "../components/warning";
var _ = require('lodash');

export default {
  name: "import-wallet",

  components: {
    WalletInput,
    NavLayout,
    Warning
  },

  computed: {
    isCompleted() {
      return (
        this.mnemonic &&
        this.password &&
        this.password2 &&
        this.password.length >= 6 &&
        this.password.length <= 20 &&
        this.password2.length >= 6 &&
        this.password2.length <= 20
      );
    }
  },

  methods: {
    changeHandler1(val) {
      let len = val.length;
      if (len < 6 || len > 20) {
        this.error1 = this.$t('wallet.create.password.passwordPlaceholder')
      }
    },
    gotoImportWallet() {
      this.$router.push({
        name: "createWallet"
      });
    },
    inputHandler1(val) {
      this.error1 = ""
    },
    changeHandler2(val) {
      let len = val.length;
      if (len < 6 || len > 20) {
        this.error2 = this.$t('wallet.create.password.passwordPlaceholder')
      }
    },
    inputHandler2(val) {
      this.error2 = ""
    },
    setChange() {
      this.mnemonic = _.trim(this.mnemonic)
    },
    importWalletAction() {
      this.$loading(this.$t("wallet.import.confirmLoading"));
      setTimeout(() => {
        API.importWallet(this.password, this.mnemonic).then(
          () => {
            this.$loading.close();
            this.$toast(this.$t("wallet.import.importSuccess"), {
              type: "center"
            });
            this.$router.push({
              name: "welcome"
            });
          },
          error => {
            this.$loading.close();
            this.$toast(formatError(error), {
              type: "center",
              duration: 5000,
              wordWrap: true
            });
          }
        );
      }, 300);
    },

    importWallet() {
      if (this.password !== this.password2) {
        this.$toast(this.$t("errors.passwordInConsistent"), {
          type: "center",
          duration: 5000,
          wordWrap: true
        });
        return false;
      }
      API.checkMnemonicCode(this.mnemonic).then(
        data => {
          if (data === true) {
            this.importWalletAction();
          } else {
            this.$toast(this.$t("wallet.import.correctMnemonic"), {
              type: "center",
              duration: 5000,
              wordWrap: true
            });
          }
        },
        error => {
          this.$loading.close();
          this.$toast(formatError(error), {
            type: "center",
            duration: 5000,
            wordWrap: true
          });
        }
      );
    }
  },

  data() {
    return {
      password: null,
      password2: null,
      mnemonic: null,
      error1: "",
      error2: ""
    };
  }
};
</script>

<style lang="scss" scoped>
@import "./warning.scss";
.title {
  font-size: 20px;
  color: #21274a;
  line-height: 28px;
  font-weight: 500;
  margin-bottom: 6px;
}
.import-w {
  margin-bottom: 36px;
  font-size:13px;
  display: flex;
  line-height: 18px;
  span:last-of-type {
    color: #062DEB;
    margin-left: 6px;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>

<style lang="scss">
.set-password {
  .layout-footer {
    padding-top: 50px !important;
  }
}
</style>