<template>
  <nav-layout back-type="close" footer-padding="60" :path="backPath" class="u-full-height">
    <div class="title">{{$t('splash.createWalletButton')}}</div>
    <wallet-input
      v-model="password"
      class="set-password"
      :label="$t('wallet.create.password.title')"
      :placeholder="$t('wallet.create.password.passwordPlaceholder')"
      type="password"
    ></wallet-input>

    <wallet-input
      v-model="password2"
      :label="$t('wallet.create.password.password2')"
      :placeholder="$t('wallet.create.password.password2Placeholder')"
      type="password"
    ></wallet-input>

    <div class="protocol-area">
      <div class="circle" @click="setToggle">
        <div class="inner" v-if="isAgreed"></div>
      </div>
      <div>I have read and agreed</div>
      <div class="terms">Services and Privacy Terms</div>
    </div>

    <template slot="footer">
      <button :disabled="!isValid" class="display-block btn-primary" @click="validatePassword">
        <div class="text" v-if="!loading">{{ $t('wallet.create.password.confirmButton') }}</div>
        <div class="loading-text" v-else>
          <img src="../../static/c-loading.svg" class="load-circle" />
          <span class="load-text">Creating...</span>
        </div>
      </button>
      <button
        class="display-block btn-text"
        @click="gotoImportWallet"
      >{{ $t('wallet.create.password.importButton') }}</button>
    </template>
    <warning :text="$t('wallet.create.password.tip')"></warning>
  </nav-layout>
</template>

<style lang="scss" scoped>
.set-password {
  margin-bottom: 24px;
}
.protocol-area {
  margin-top: 12px;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #c0c3d2;
  .circle {
    margin-right: 4px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 1px solid #c0c3d2;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    .inner {
      width: 10px;
      height: 10px;
      background-color: #21264a;
      border-radius: 50%;
    }
  }
  .terms {
    margin-left: 4px;
    color: #062deb;
    text-decoration: underline;
    cursor: pointer;
  }
}
.loading-text {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .load-circle {
    margin-right: 8px;
    animation: load 1s ease-in infinite;
  }
  @keyframes load {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}

.title {
  font-size: 20px;
  color: #21274a;
  line-height: 28px;
  font-weight: 500;
  margin-bottom: 30px;
}
</style>

<script type="text/jsx">
import WalletInput from "../../components/input";
import NavLayout from "../../components/nav-layout";
import Warning from "../../components/warning";
import mnemonic from "./mnemonic";
import API from "../../api";
import eventBus from "../../account/bus";

export default {
  components: {
    WalletInput,
    NavLayout,
    Warning
  },

  computed: {
    isValid() {
      return (
        this.password &&
        this.password2 &&
        this.password.length >= 6 &&
        this.password.length <= 20 &&
        this.password2.length >= 6 &&
        this.password2.length <= 20 &&
        this.isAgreed
      );
    },

    backPath() {
      return {
        name: "welcome"
      };
    }
  },

  methods: {
    validatePassword() {
      if (this.password !== this.password2) {
        this.$toast(this.$t("errors.passwordInConsistent"), {
          type: "center"
        });

        return;
      }
      this.loading = true
      this.generateMnemonicCode();
    },

    gotoImportWallet() {
      this.$router.push({
        name: "importWallet"
      });
    },

    setToggle() {
      this.isAgreed = !this.isAgreed;
    },

    generateMnemonicCode() {
      mnemonic.get().then(
        data => {
          this.mnemonic = data;
          this.goAccountHome();
        },
        error => {
          console.log("get mnemonic error:", error.message);
          this.loading = false
        }
      );
    },

    goAccountHome() {
      setTimeout(() => {
        let promise;

        promise = API.createWallet(this.password, this.mnemonic);

        promise.then(
          () => {
            this.loading = false
            if (!this.isCreatingWallet) {
              eventBus.$emit("header:state:refresh");
            }

            mnemonic.clear();

            this.$router.push({
              name: "backupWalletMnemonic",

              query: {
                password: this.password,
                mnemonic: this.mnemonic
              }
            });
          },
          error => {
            this.loading = false
            console.log("create wallet error:", error);
            this.$toast(
              this.$t("wallet.create.validate.createFailure") +
                " " +
                formatError(error),
              {
                type: "center",
                duration: 5000,
                wordWrap: true
              }
            );
          }
        );
      }, 300);
    }
  },

  data() {
    return {
      password: "",
      password2: "",
      warningShow: true,
      isAgreed: false,
      mnemonic: "",
      loading: false
    };
  }
};
</script>
