<template>
  <div class="wallet-container">
    <div class="welcome-container" v-show="!loading">
      <div class="logo-container">
        <img src="../static/main-logo.png" width="136" />
        <div class="slogin">Building, sharing, and sharing Waykichain Ecological platform</div>
      </div>

      <div class="login-container" v-show="vaultCreated && isLocked">
        <div class="password-wrap">
          <div class="error-msg" v-if="error">{{ error }}</div>
          <input
            class="display-block"
            :class="{error: error}"
            :type="type"
            v-model="password"
            @focus="focusHandler"
            @blur="blurHandler"
            ref="password1"
          />
          <div class="holder" :class="{shouldTop: shouldTop}">Password</div>
          <div class="actions" v-if="showClear">
            <div class="action clear" @click="setClear"></div>
            <div class="action line"></div>
            <div
              class="action check"
              :class="{cansee: cansee}"
              v-if="showClear"
              @click="toggleCansee"
            ></div>
          </div>
        </div>
        <button class="display-block btn-primary" @click="unlock">{{ $t('splash.unlockButton') }}</button>
        <div class="recover" @click="importWallet">{{ $t('splash.restoreWalletButton') }}</div>
      </div>

      <div class="create-container" v-show="!vaultCreated">
        <button
          class="display-block btn-primary btn-higher"
          @click="createWallet"
        >{{ $t('splash.createWalletButton') }}</button>
        <button
          class="display-block btn-higher btn-lighter"
          @click="importWallet"
        >{{ $t('splash.importWalletButton') }}</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.welcome-container {
  position: relative;
  height: 100%;
  box-sizing: border-box;
}

.logo-container {
  padding-top: 80px;
  text-align: center;
  .slogin {
    margin-top: 50px;
    color: #7c8bb9;
    font-size: 17px;
    padding: 0 30px;
    line-height: 28px;
    font-weight: 300;
  }
}

.create-container {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 48px;
  padding: 0 60px;
}
.login-container {
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 44px;
  .recover {
    text-align: center;
    color: #062deb;
    text-decoration: underline;
    font-size: 16px;
    line-height: 22px;
    margin-top: 20px;
    cursor: pointer;
  }
  .password-wrap {
    position: relative;
    height: 50px;
    margin-bottom: 30px;
    .error-msg {
      line-height: 18px;
      position: absolute;
      bottom: -18px;
      right: 0;
      font-size: 12px;
      color: #f75555;
    }
    .holder {
      position: absolute;
      left: 14px;
      top: 15px;
      font-size: 15px;
      color: #8187a5;
      line-height: 20px;
      background-color: #fff;
      z-index: 1;
      transition: all 150ms linear;
      &.shouldTop {
        padding: 0 6px;
        top: -10px;
        z-index: 3;
        font-size: 12px;
      }
    }
    input {
      position: absolute;
      left: 0;
      top: 0;
      margin: 0;
      width: 100%;
      height: 50px;
      z-index: 2;
      background: none;
      padding-left: 14px;
      padding-right: 83px;
      &:focus {
        border-color: #8187a5;
      }
      &.error {
        border-color: #f75555;
      }
    }
  }
  .actions {
    position: absolute;
    right: 0px;
    top: 0px;
    z-index: 3;
    height: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .action {
      background-color: #ccc;
      margin-right: 12px;
      cursor: pointer;
    }
    .clear {
      margin-left: 12px;
      width: 16px;
      height: 16px;
      background: url("../static/input-clear.svg");
    }
    .line {
      width: 1px;
      height: 17px;
      background-color: #d1d2da;
    }
    .check {
      width: 18px;
      height: 14px;
      background: url("../static/cansee.svg");
      &.cansee {
        background: url("../static/cannotsee.svg");
      }
    }
  }
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
      password: "",
      shouldTop: false,
      showClear: false,
      cansee: false,
      type: "password",
      error: ""
    };
  },

  beforeCreate() {
    sessionStorage.removeItem("password");
    sessionStorage.removeItem("password2");
    sessionStorage.removeItem("isAgreed");
  },

  created() {
    // if (!sessionStorage.getItem("isActive")) {
    //   this.$router.push("/wallet/update");
    //   return;
    // }
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
    setTimeout(() => {
      this.$refs.password1.onkeyup = data => {
        if (data.keyCode === 13) {
          this.unlock();
        }
      };
    }, 200);
  },

  beforeDestroy() {
    this.$refs.password1.onkeyup = null;
  },

  watch: {
    password(val) {
      if (val) {
        this.showClear = true;
      } else {
        this.showClear = false;
      }
    },
    cansee(val) {
      if (val) {
        this.type = "text";
      } else {
        this.type = "password";
      }
    }
  },

  methods: {
    focusHandler() {
      this.shouldTop = true;
    },
    blurHandler() {
      if (this.password) return;
      this.shouldTop = false;
    },
    setFocus() {
      this.$refs.password1 && this.$refs.password1.focus();
    },
    setClear() {
      this.password = "";
      this.setFocus();
      setTimeout(() => {
        this.showClear = false;
      }, 10);
    },
    toggleCansee() {
      this.cansee = !this.cansee;
    },
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
          // this.$toast(this.$t("errors.passwordError"), {
          //   type: "center"
          // });
          this.error = this.$t("errors.passwordError");
          // throw error
        }
      );
    },

    createWallet() {
      this.checkNetWork();
      this.$router.push({
        name: "createWallet"
      });
    },

    importWallet() {
      this.checkNetWork();
      this.$router.push({
        name: "importWallet"
      });
    },
    checkNetWork() {
      const localNet = localStorage.getItem("network");
      if (localNet) {
        return;
      }
      localStorage.setItem("network", "mainnet");
    }
  }
};
</script>
