<template>
  <nav-layout footer-padding="60" back-type="close" class="u-full-height">
    <div class="title">{{$t('wallet.import.title')}}</div>
    <wallet-input
      v-model="mnemonic"
      :label="$t('wallet.import.mnemonic')"
      :placeholder="$t('wallet.import.mnemonicPlaceholder')"
      type="textarea"
      style="margin-bottom: 24px;"
    ></wallet-input>

    <wallet-input
      v-model="password"
      :label="$t('wallet.import.password')"
      :placeholder="$t('wallet.import.passwordPlaceholder')"
      type="password"
      style="margin-bottom: 24px;"
      :pattern="/^[0-9a-zA-Z_]{0,}$/"
    ></wallet-input>

    <wallet-input
      v-model="password2"
      :label="$t('wallet.import.password2')"
      :placeholder="$t('wallet.import.password2Placeholder')"
      type="password"
      style="margin-bottom: 0;"
      :pattern="/^[0-9a-zA-Z_]{0,}$/"
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
      mnemonic: null
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
  margin-bottom: 30px;
}
</style>
