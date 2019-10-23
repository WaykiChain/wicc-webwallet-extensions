<template>
  <div class="wallet-container">
    <div class="welcome-container" v-show="!loading">
      <div class="logo-container">
        <img src="../static/main-logo.png" width="107">
      </div>

      <div class="login-container" v-show="vaultCreated && isLocked">
        <input
          class="display-block"
          type="password"
          v-model="password"
          :placeholder="$t('splash.passwordPlaceholder')"
        >
        <button class="display-block btn-primary" @click="unlock">{{ $t('splash.unlockButton') }}</button>
        <button
          class="display-block btn-text"
          @click="importWallet"
        >{{ $t('splash.restoreWalletButton') }}</button>
      </div>

      <div class="create-container" v-show="!vaultCreated">
        <button
          class="display-block btn-primary"
          @click="createWallet"
        >{{ $t('splash.createWalletButton') }}</button>
        <button class="display-block" @click="importWallet">{{ $t('splash.importWalletButton') }}</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.welcome-container {
  position: relative;
  height: 100%;
  box-sizing: border-box;
  padding: 16px;
}

.logo-container {
  padding-top: 128px;
  text-align: center;
}

.create-container,
.login-container {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 16px;
}
</style>

<script type="text/jsx">
import API from "../api";

export default {
  data() {
    return {
      loading: true,
      isLocked: true,
      vaultCreated: false,
      password: ""
    };
  },

  created() {
    API.getState().then(
      state => {
        this.loading = false;
        this.isLocked = state.isLocked;
        this.vaultCreated = state.vaultCreated;

        if (!this.isLocked || !this.vaultCreated) {
          const restoreConfigString = localStorage.getItem("WICC_RESTORE_PATH");

          if (restoreConfigString) {
            try {
              const restoreConfig = JSON.parse(restoreConfigString);
              if (restoreConfig) {
                return this.$router.push(restoreConfig);
              }
            } catch (error) {
              console.log("parse restore config error:", error);
            } finally {
              localStorage.setItem("WICC_RESTORE_PATH", null);
            }
          }

          if (this.vaultCreated) {
            this.gotoMain();
          }
        }
      },
      error => {
        this.loading = false;
        //    throw error
      }
    );
  },

  methods: {
    gotoMain() {
      this.$router.push({
        name: "accountMain"
      });
    },

    unlock() {
      API.unlock(this.password).then(
        () => {
          this.gotoMain();
        },
        error => {
          this.$toast(this.$t("errors.passwordError"), {
            type: "center"
          });
          // throw error
        }
      );
    },

    createWallet() {
      this.checkNetWork()
      this.$router.push({
        name: "createWallet"
      });
    },

    importWallet() {
      this.checkNetWork()
      this.$router.push({
        name: "importWallet"
      });
    },
    checkNetWork(){
      const localNet = localStorage.getItem('network')
      if (localNet){
        return
      }
      localStorage.setItem('network','mainnet')
    }
  }
};
</script>
