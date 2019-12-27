<template>
  <div class="coin-card">
    <div class="account-info">
      <div class="account-refresh" :class="{isRefreshing: isRefreshing}" @click="setRefresh">
        <img src="../../static/refresh.svg" alt />
      </div>
      <div class="account-detail">
        <div class="name">{{ value }}</div>
        <div class="address">{{cutMiddleStr(address,5)}}</div>
      </div>
      <div class="account-more" v-click-outside="hideMenu" @click="toggleMenu">
        <img src="../../static/actions.svg" alt />
      </div>
    </div>
    <div class="account-action">
      <div class="inner">
        <div class="item collect" @click="collect">
          <div class="wrap">
            <div class="icon">
              <img src="../../static/collect.svg" alt />
              <div class="shine"></div>
            </div>
            <div class="title">Collect</div>
          </div>
        </div>
        <div class="item send" @click="send">
          <div class="wrap">
            <div class="icon">
              <img src="../../static/send.svg" alt />
              <div class="shine"></div>
            </div>
            <div class="title">Send</div>
          </div>
        </div>
        <div class="line"></div>
      </div>
    </div>

    <div class="dropdown" v-show="showMenu">
      <div class="menu-item vm" @click="viewMnemonic">{{ $t('account.header.viewMnemonic') }}</div>
      <div class="menu-item ep" @click="viewPrivateKey">{{ $t('account.header.exportPrivateKey') }}</div>
      <a :href="`https://testnet.waykiscan.com/#/address/${address}`" target="_blank" class="menu-item ad" v-if="address && address[0] === 'w'">Account details</a>
      <a :href="`https://www.waykiscan.com/#/address/${address}`" target="_blank" class="menu-item ad" v-else>Account details</a>
      <!-- <div class="menu-item man">Modify account name</div> -->
      <!-- <div class="menu-item da">Delete account</div> -->
    </div>

    <!-- <div class="coin-card-body">
      <span class="coin-value">{{ value }}</span>
      <button
          v-if="showRegisterButton"
          @click="openRegisterConfirm"
          class="btn-account-active btn-text">{{ $t('common.activeAccount') }}</button>
    </div>
    <div class="coin-card-footer">
      <div class="coin-address">{{cutMiddleStr(address,10)}}</div>
      <div class="coin-card-btn coin-card-copy">
        <img src="../../static/copy-icon-white.svg" />
      </div>
      <div class="coin-separator"></div>
      <div class="coin-card-btn" @click="openQrCode">
        <img src="../../static/qrcode-icon-white.svg" />
      </div>
    </div>-->
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";
import API from "../../api";
import formatError from "../../api/format-error";
import { openQrCodeDialog, openRegisterConfirmDialog } from "../dialog";
import eventBus from "../bus";

export default {
  name: "coin-card",
  directives: {
    ClickOutside
  },

  props: {
    name: {
      type: String,
      required: true
    },
    address: {
      type: String
    },
    value: {
      required: true
    },
    showRegisterButton: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      registerConfirmVisible: false,
      showMenu: false,
      isRefreshing: false
    };
  },

  methods: {
    setRefresh() {
      if (this.isRefreshing) return
      this.isRefreshing = true;
      setTimeout(() => {
        this.isRefreshing = false;
      }, 600);
      eventBus.$emit("on-refresh");
    },

    viewMnemonic() {
      eventBus.$emit("on-viewMnemonic-click");
    },

     viewPrivateKey() {
      eventBus.$emit("on-viewPrivateKey-click");
    },

    openQrCode() {
      openQrCodeDialog(this.address);
    },

    hideMenu() {
      this.showMenu = false;
    },

    toggleMenu() {
      this.showMenu = !this.showMenu;
    },

    send() {
      this.$router.push("/account/send")
    },

    collect() {
      this.$router.push("/account/collect?address=" + this.address)
    },

    openRegisterConfirm() {
      if (this.value === 0) {
        this.$toast(this.$t("errors.insufficientBalance"), {
          type: "center"
        });
        return;
      }

      API.validateRegisterAccount(this.address).then(
        () => {
          openRegisterConfirmDialog(this.address);
        },
        error => {
          this.$toast(formatError(error), {
            type: "center",
            duration: 5000,
            wordWrap: true
          });
        }
      );
    },

    getCopyText() {
      return this.address;
    },
    cutMiddleStr(str, saveNum) {
      if (str) {
        return (
          str.substr(0, saveNum) +
          "..." +
          str.substring(str.length, str.length - saveNum)
        );
      }
      return "";
    }
  }
};
</script>

<style lang="scss" scoped>
.coin-card {
  position: relative;
  color: #fff;
  padding: 14px 20px 30px;
  box-sizing: border-box;
  border-radius: 4px;
}

.dropdown {
  position: absolute;
  z-index: 999;
  right: 10px;
  top: 55px;
  background: rgba(0, 0, 0, 0.8);
  width: 200px;
  max-height: 500px;
  overflow: auto;
  border-radius: 6px;
  font-size: 14px;
  .menu-separator {
    width: 100%;
    height: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .menu-item {
    cursor: pointer;
    padding: 12px 0 12px 42px;
    color: #fff;
    display: block;
    &.vm {
      background: url("../../static/vm.svg") no-repeat 14px center;
      background-size: 18px;
    }
    &.ep {
      background: url("../../static/epk.svg") no-repeat 14px center;
      background-size: 18px;
    }
    &.ad {
      background: url("../../static/ad.svg") no-repeat 14px center;
      background-size: 18px;
    }
    &.man {
      background: url("../../static/man.svg") no-repeat 14px center;
      background-size: 18px;
    }
    &.da {
      background: url("../../static/da.svg") no-repeat 14px center;
      background-size: 18px;
    }
  }
}

.account-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.account-refresh {
  width: 18px;
  height: 18px;
  cursor: pointer;
  &.isRefreshing {
    transform: rotate(360deg);
    transition: all 500ms linear;
  }
  img {
    float: left;
    width: 100%;
  }
}
.account-detail {
  text-align: center;
  .name {
    height: 24px;
    font-size: 18px;
    line-height: 24px;
    font-weight: 500;
    color: #1d213c;
  }
  .address {
    height: 18px;
    font-size: 13px;
    line-height: 18px;
    color: #8187a5;
  }
}
.account-more {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  cursor: pointer;
  img {
    width: 100%;
  }
}
.account-action {
  padding: 16px 4px 0;
  .inner {
    padding: 18px 0 12px;
    background-color: #f5f7fa;
    border-radius: 10px;
    display: flex;
    position: relative;
  }
  .item {
    width: 50%;
    height: 70px;
    font-size: 15px;
    color: #091340;
    font-weight: 500;
    display: flex;
    justify-content: center;
  }
  .wrap {
    cursor: pointer;
  }
  .icon {
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    &:hover {
      .shine {
        left: 100px;
        transition: left 200ms linear;
      }
    }
    .shine {
      width: 66px;
      height: 1000px;
      background-color: rgba(255, 255, 255, 0.2);
      position: absolute;
      left: -100px;
      transform: rotate(45deg);
      box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.2);
    }
    img {
      width: 44px;
      height: 44px;
    }
  }
  .title {
    margin-top: 6px;
    line-height: 20px;
    text-align: center;
  }
  .line {
    width: 1px;
    height: 28px;
    background: #d9dbde;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
}
</style>
