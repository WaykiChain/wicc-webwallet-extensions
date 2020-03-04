<template>
  <nav-layout
    back-type="close"
    footer-padding="60"
    :path="backPath"
    class="u-full-height set-password"
  >
    <div class="title">{{$t('splash.createWalletButton')}}</div>
    <div class="import-w">
      <span style="color:#8187A5;">{{$t('splash.created')}}?</span>
      <span @click="gotoImportWallet">{{ $t('wallet.import.title') }}</span>
    </div>
    <wallet-input
      v-model="password"
      class="set-password"
      :label="$t('wallet.create.password.title')"
      :placeholder="$t('wallet.create.password.passwordPlaceholder')"
      type="password"
      @change="changeHandler1"
      @input="inputHandler1"
      :message="error1"
      :pattern="/^\S{0,}$/"
    ></wallet-input>

    <wallet-input
      v-model="password2"
      :label="$t('wallet.create.password.password2')"
      :placeholder="$t('wallet.create.password.password2Placeholder')"
      type="password"
      @change="changeHandler2"
      @input="inputHandler2"
      :message="error2"
      :pattern="/^\S{0,}$/"
    ></wallet-input>

    <template slot="footer">
      <button :disabled="!isValid" class="display-block btn-primary" @click="validatePassword">
        <div class="text" v-if="!loading">{{$t('splash.createWalletButton')}}</div>
        <div class="loading-text" v-else>
          <img src="../../static/c-loading.svg" class="load-circle" />
          <span class="load-text">{{$t('wallet.create.creating')}}</span>
        </div>
      </button>

      <div class="protocol-area">
        <div class="circle" :class="{isAgreed: isAgreed}" @click="setToggle">
          <div class="inner" v-if="isAgreed"></div>
        </div>
        <div>{{$t('wallet.create.read')}}</div>
        <div class="terms" @click="clickHandler">{{$t('wallet.create.terms')}}</div>
      </div>
    </template>
    <warning :text="$t('wallet.create.password.tip')"></warning>
  </nav-layout>
</template>

<style lang="scss" scoped>
.set-password {
  margin-bottom: 24px;
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
.protocol-area {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #c0c3d2;
  .circle {
    margin-right: 4px;
    width: 14px;
    height: 14px;
    border-radius: 3px;
    border: 1px solid #c0c3d2;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    &.isAgreed {
      background-color: #0B23EB;
      border-color: #0B23EB;
    }
    .inner {
      width: 10px;
      height: 10px;
      background: url("../../static/agree.svg") no-repeat center center;
    }
  }
  .terms {
    margin-left: 4px;
    color: #062deb;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
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
  margin-bottom: 6px;
}
</style>
<style lang="scss">
.set-password {
  .layout-footer {
    padding-top: 34px !important;
  }
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

  created() {
    setTimeout(() => {
      this.password = sessionStorage.getItem("password") || "";
      this.password2 = sessionStorage.getItem("password2") || "";
      this.isAgreed =
        sessionStorage.getItem("isAgreed") === "true" ? true : false;
    }, 20);
  },

  methods: {
    changeHandler1(val) {
      let len = val.length;
      if (len < 6 || len > 20) {
        this.error1 = this.$t("wallet.create.password.passwordPlaceholder");
      }
    },
    inputHandler1(val) {
      this.error1 = "";
    },
    changeHandler2(val) {
      let len = val.length;
      if (len < 6 || len > 20) {
        this.error2 = this.$t("wallet.create.password.passwordPlaceholder");
      }
    },
    inputHandler2(val) {
      this.error2 = "";
    },
    clickHandler() {
      sessionStorage.setItem("password", this.password);
      sessionStorage.setItem("password2", this.password2);
      sessionStorage.setItem("isAgreed", this.isAgreed);
      this.$router.push({ name: "protocol" });
    },
    validatePassword() {
      if (this.password !== this.password2) {
        this.$toast(this.$t("errors.passwordInConsistent"), {
          type: "center"
        });

        return;
      }
      this.loading = true;
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
          this.loading = false;
        }
      );
    },

    goAccountHome() {
      setTimeout(() => {
        let promise;

        promise = API.createWallet(this.password, this.mnemonic);

        promise.then(
          () => {
            this.loading = false;
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
            this.loading = false;
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
      loading: false,
      error1: "",
      error2: ""
    };
  }
};
</script>
