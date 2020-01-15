<template>
  <div>
    <div class="logo-container">
      <img src="../static/main-logo.png" width="136" />
      <!-- <div class="slogin">{{ $t('common.slogin') }}</div> -->
    </div>

    <div class="login-container">
      <div class="password-wrap">
        <input
          class="display-block"
          :class="{error: error}"
          :type="type"
          v-model="password"
          @focus="focusHandler"
          @blur="blurHandler"
          @input="inputHandler"
          ref="password1"
        />
        <div class="holder" :class="{shouldTop: shouldTop, deep: error}">Password</div>
        <div class="error-msg" v-if="error">{{ error }}</div>
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
      <button
        class="display-block btn-primary"
        :disabled="password.length < 6 || password.length > 20"
        @click="unlock"
      >{{ $t('splash.unlockButton') }}</button>
    </div>
  </div>
</template>

<script>
import API from "../api";
let _ = require("lodash");
export default {
  name: "window-login",

  created() {
    setTimeout(() => {
      if (!this.$refs.password1) return;
      this.$refs.password1.onkeyup = data => {
        if (data.keyCode === 13) {
          this.unlock();
        }
      };
    }, 200);
    const route = this.$router.currentRoute;
    this.callbackId = route.query.callbackId;
    try {
      if (route.query.redirectPage) {
        this.redirectPage = JSON.parse(route.query.redirectPage);
      }
    } catch (error) {
      console.log(error);
    }

    // if (!this.redirectPage) {
    //   throw new Error('redirectUrl is required!')
    // }
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

  data() {
    return {
      password: "",
      redirectPage: null,
      error: "",
      shouldTop: false,
      showClear: false,
      cansee: false,
      type: "password"
    };
  },

  methods: {
    inputHandler() {
      this.error = "";
      this.password = this.password.replace(/\s+/gi, item => "");
    },
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
      this.error = "";
      this.setFocus();
      setTimeout(() => {
        this.showClear = false;
      }, 10);
    },
    toggleCansee() {
      this.cansee = !this.cansee;
    },
    gotoTarget() {
      const route = this.$router.currentRoute;
      if (!route.query.getDefaultAccount) {
        return this.$router.push(this.redirectPage);
      }
      API.callRaw("getDefaultAccount", {}).then(
        value => {
          console.log(this.callbackId);
          if (this.callbackId) {
            API.callPageCallback(this.callbackId, null, value);
          }
          setTimeout(() => {
            window.close();
          }, 300);
        },
        error => {
          // if (this.callbackId) {
          //   API.callPageCallback(this.callbackId, error, null);
          // }

          console.log(error);
        }
      );
    },

    unlock() {
      API.unlock(this.password).then(
        () => {
          this.gotoTarget();
        },
        error => {
          this.error = this.$t("errors.passwordError");
          // this.$toast(this.$t("errors.passwordError"), {
          //   type: "center"
          // });
          //  throw error
        }
      );
    }
  }
};
</script>

<style scoped lang="scss">
.logo-container {
  padding-top: 90px;
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
    margin-bottom: 40px;
    .error-msg {
      white-space: nowrap;
      line-height: 52px;
      position: absolute;
      left: 0;
      bottom: -59px;
      font-size: 24px;
      padding: 0 16px;
      color: #ed4b4d;
      background-color: #ffe6e5;
      border-radius: 6px;
      z-index: 10;
      border: 1px solid #e74b4d;
      transform: scale(0.5);
      transform-origin: left top;
      &:after {
        content: "";
        position: absolute;
        left: 20px;
        top: -15%;
        width: 14px;
        height: 14px;
        border-left: 1px solid rgb(226, 66, 68);
        border-top: 1px solid rgb(226, 66, 68);
        background-color: #ffe6e5;
        transform: rotate(45deg);
        z-index: 0;
        box-sizing: border-box;
        border-top-left-radius: 4px;
      }
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
      &.deep {
        color:  #f75555;
      }
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