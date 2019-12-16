<template>
  <nav-layout :path="backPath" class="u-full-height">
    <div class="title">{{$t('wallet.create.password.title')}}</div>
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
      <button
        :disabled="!isValid"
        class="display-block btn-primary"
        @click="validatePassword"
      >{{ $t('wallet.create.password.confirmButton') }}</button>
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
  color: #C0C3D2;
  .circle {
    margin-right: 4px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 1px solid #C0C3D2;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    .inner {
      width: 10px;
      height: 10px;
      background-color: #21264A;
      border-radius: 50%;
    }
  }
  .terms {
    margin-left: 4px;
    color: #062DEB;
    text-decoration: underline;
    cursor: pointer;
  }
}
.title {
  font-size: 20px;
  color: #21274a;
  line-height: 28px;
  font-weight: 450;
  margin-bottom: 30px;
}
</style>

<script type="text/jsx">
import WalletInput from "../../components/input";
import NavLayout from "../../components/nav-layout";
import Warning from "../../components/warning";

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

      this.$router.push({
        name: "backupWalletMnemonic",

        query: {
          password: this.password
        }
      });
    },

    gotoImportWallet() {
      this.$router.push({
        name: "importWallet"
      });
    },

    setToggle() {
      this.isAgreed = !this.isAgreed
    }
  },

  data() {
    return {
      password: "",
      password2: "",
      warningShow: true,
      isAgreed: false
    };
  }
};
</script>
