<template>
  <div class="wallet-main-header">
    <div class="dropdown-wrapper network-wrapper" v-click-outside="hideNetwork">
      <div class="dropdown-toggle" @click="toggleNetwork">
        <div
          class="dropdown-toggle-label"
        >{{ getNetworkText(currentNet != '' ? currentNet : network) }}</div>
        <div class="dropdown-toggle-indicator"></div>
      </div>
      <div class="dropdown" v-show="showNetwork">
        <div class="dropdown-header">
          <i>{{ $t('account.header.network') }}</i>
        </div>
        <div class="menu-separator"></div>

        <ul class="network-list">
          <li class="defult-network">{{ $t('account.header.defaultNetwork') }}</li>
          <li
            class="menu-item network-item"
            @click="setNetwork('mainnet')"
            :class="{
              active: currentNet != '' ? false : network === 'mainnet'
            }"
          >{{ getNetworkText('mainnet') }}</li>
          <li
            class="menu-item network-item"
            @click="setNetwork('testnet')"
            :class="{
              active: currentNet != '' ? false : network === 'testnet'
            }"
          >{{ getNetworkText('testnet') }}</li>

          <li
            class="menu-item network-item"
            v-for="(item,index) in netList"
            :key="index"
            @click="setNetwork(item)"
            :class="{
              active: currentNet === item.name
            }"
          >{{ item.name }}</li>
        </ul>
        <div class="menu-separator"></div>
        <p class="addNet" @click="addNet">
          <img src="../../static/add-net.svg" alt />
          <span>{{$t('setting.index.addNet')}}</span>
        </p>
      </div>
    </div>
    <div class="dropdown-wrapper menu-wrapper" v-click-outside="hideMenu">
      <a href="https://cdp.waykichain.com/" target="_blank" class="link">
        <img src="../../static/cdp.svg" alt />
        <div class="link-title">
          <span>CDP</span>
          <i></i>
        </div>
      </a>
      <a href="https://dex.waykichain.com/" target="_blank" class="link">
        <img src="../../static/dex.svg" alt />
        <div class="link-title">
          <span>DEX</span>
          <i></i>
        </div>
      </a>
      <div class="dropdown-toggle" @click="toggleMenu" v-if="!hideMenuToggle">
        <img src="../../static/main-header-icon.svg" alt="click show menu" />
      </div>
      <div class="dropdown" v-show="showMenu">
        <div class="dropdown-header">
          <span>My Accounts</span>
          <span class="logout-btn" @click="logout">{{ $t('account.header.logout') }}</span>
        </div>
        <div class="menu-separator"></div>
        <ul class="account-list">
          <li
            v-for="(account,index) in visibleAccounts"
            :key="index"
            class="account-item"
            @click="setActiveAccount(account)"
            :class="{
              active: activeAccount.id === account.id
            }"
          >{{ $t('common.accountLabel') }} {{ account.index + 1 }}</li>
        </ul>
        <div class="menu-separator"></div>
        <div
          class="menu-item create"
          @click="getMnemonic"
        >{{ $t('account.header.createAccount') }}</div>
        <div
          class="menu-item import"
          @click="gotoImportAccount"
        >{{ $t('account.header.importAccount') }}</div>
        <div class="menu-separator"></div>
        <div class="menu-item about" @click="gotoAbout">{{ $t('account.header.about') }}</div>
        <div class="menu-item setting" @click="gotoSetting">{{ $t('account.header.setting') }}</div>
        <div class="menu-separator"></div>
      </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";
import API from "../../api/index";
import mnemonic from "../../wallet/create/mnemonic.js";
import eventBus from "../bus";
import {
  openMnemonicDialog,
  openPkDialog,
  openConfirmPassword
} from "../dialog/";
import StateWatcher from "../state-watcher";

export default {
  name: "main-header",

  mixins: [StateWatcher],

  directives: {
    ClickOutside
  },

  props: {
    hideMenuToggle: {
      type: Boolean,
      default: false
    }
  },

  created() {
    this.refreshState();
    this.netList = JSON.parse(localStorage.getItem("netList"));
    const myselfNet = JSON.parse(localStorage.getItem("myselfNetWork"));
    this.currentNet = myselfNet ? myselfNet.name : "";
    this.eventBus.$on("header:state:refresh", this.refreshState);
    this.eventBus.$on("on-viewMnemonic-click", this.viewMnemonic);
    this.eventBus.$on("on-viewPrivateKey-click", this.viewPrivateKey);
  },

  destroyed() {
    this.eventBus.$off("header:state:refresh", this.refreshState);
    this.eventBus.$off("on-viewMnemonic-click", this.viewMnemonic);
    this.eventBus.$off("on-viewPrivateKey-click", this.viewPrivateKey);
  },

  data() {
    return {
      showNetwork: false,
      showMenu: false,
      forceLogin: false,
      netList: [],
      currentNet: "",
      mnemonic: ""
    };
  },

  computed: {
    visibleAccounts() {
      const { network, accounts } = this;
      return accounts.filter(account => {
        return !(account.type === "privateKey" && account.network !== network);
      });
    }
  },

  methods: {
    addNet() {
      this.$router.push({
        name: "changeNet"
      });
    },
    hideMenu() {
      this.showMenu = false;
    },

    toggleMenu() {
      this.showMenu = !this.showMenu;
    },

    hideNetwork() {
      this.showNetwork = false;
    },

    toggleNetwork() {
      this.showNetwork = !this.showNetwork;
    },

    getNetworkText(network) {
      if (network === "mainnet") {
        return this.$t("account.header.mainnet");
      } else if (network == "testnet") {
        return this.$t("account.header.testnet");
      } else {
        return network;
      }
    },

    setNetwork(network) {
      localStorage.removeItem("srcRegID");
      var net = "";
      if (network.name) {
        net = network.network;
        localStorage.setItem("network", network.network);
        this.currentNet = network.name;
        localStorage.setItem("myselfNetWork", JSON.stringify(network));
      } else {
        net = network;
        localStorage.setItem("network", network);
        this.currentNet = network;
        localStorage.removeItem("myselfNetWork");
      }
      API.setNetwork(net).then(({ network, account }) => {
        this.network = network;
        this.$emit("network-change", network, this);
        eventBus.$emit("network-change", network);
        if (account) {
          this.activeAccount = account;
          eventBus.$emit("active-account-change", account);
        }
      });
      const myselfNet = JSON.parse(localStorage.getItem("myselfNetWork"));
      this.currentNet = myselfNet ? myselfNet.name : "";
      this.hideNetwork();
    },

    setActiveAccount(account) {
      localStorage.removeItem("srcRegID");
      API.setActiveAccount(account.id).then(({ network }) => {
        this.activeAccount = account;
        eventBus.$emit("active-account-change", account);
        if (network) {
          this.network = network;
          this.$emit("network-change", network, this);
          eventBus.$emit("network-change", network);
        }
      });
      this.hideMenu();
    },

    logout() {
      API.logout().then(() => {
        this.$router.push({
          name: "welcome"
        });
      });
    },

    gotoSetting() {
      this.$router.push({
        name: "setting"
      });
    },

    gotoImportAccount() {
      this.$router.push({
        name: "importAccount"
      });

      this.hideMenu();
    },
    getMnemonic() {
      mnemonic.get().then(
        data => {
          this.mnemonic = data;
          this.gotoCreateAccount();
        },
        error => {
          console.log("get mnemonic error:", error.message);
          this.loading = false
        }
      );
    },
    gotoCreateAccount() {
      this.$loading(this.$t("wallet.create.validate.confirmLoading"));

      setTimeout(() => {
        let promise;

        promise = API.createAccount(this.mnemonic);

        promise.then(
          () => {
            this.$loading.close();

            mnemonic.clear();

            this.$router.push({
              name: "createAccount",
              query: {
                mnemonic: this.mnemonic
              }
            });
          },
          error => {
            console.log("create wallet error:", error);
            this.$loading.close();
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

      this.hideMenu();
    },

    gotoAbout() {
      this.$router.push({
        name: "about"
      });

      this.hideMenu();
    },

    viewMnemonic() {
      // openConfirmPassword().then(() => {
        openMnemonicDialog(this.network, this.activeAddress);
      // });
      this.hideMenu();
    },

    viewPrivateKey() {
      // openConfirmPassword().then(() => {
        openPkDialog(this.network, this.activeAddress);
      // });
      this.hideMenu();
    }
  }
};
</script>

<style lang="scss" scoped>
.addNet {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 19px 0;
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
  color: #fff;
  opacity: 0.7;
  span {
    padding-left: 7px;
  }
  &:hover {
    opacity: 1;
  }
}
.wallet-main-header {
  height: 60px;
  background-color: #f5f7fa;
  z-index: 1;
  box-sizing: border-box;
  display: flex;
  padding: 0 14px;
}

.dropdown-wrapper {
  position: relative;
}

.dropdown {
  position: absolute;
  z-index: 999;
  left: 0;
  top: 55px;
  background: rgba(0, 0, 0, 0.8);
  width: 300px;
  max-height: 500px;
  overflow: auto;
  border-radius: 6px;
}

.dropdown-toggle {
  position: relative;
  cursor: pointer;

  > img {
    width: 34px;
    height: 34px;
    float: left;
  }

  > img:hover {
    opacity: 0.8;
  }
}

.menu-wrapper {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .dropdown {
    left: auto;
    top: 56px;
    right: -8px;
  }
  .dropdown-toggle {
    width: 34px;
    height: 34px;
  }
  .link {
    width: 20px;
    height: 20px;
    margin-right: 20px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    &:hover {
      .link-title {
        display: block;
      }
    }
    .link-title {
      position: absolute;
      bottom: -37px;
      left: 50%;
      margin-left: -21px;
      width: 42px;
      height: 22px;
      background-color: rgba(0, 0, 0, 0.85);
      border-radius: 6px;
      color: #fff;
      line-height: 22px;
      text-align: center;
      font-size: 13px;
      display: none;
      i {
        width: 16px;
        height: 8px;
        position: absolute;
        left: 50%;
        top: -8px;
        margin-left: -8px;
        overflow: hidden;
        &:after {
          content: "";
          position: absolute;
          left: 3px;
          top: 4px;
          width: 10px;
          height: 10px;
          border-radius: 2px;
          background-color: rgba(0, 0, 0, 0.85);
          transform: rotate(45deg);
        }
      }
    }
  }
}

.network-wrapper {
  width: 170px;
  display: flex;
  align-items: center;

  .dropdown-toggle {
    box-sizing: border-box;
    width: 100%;
    height: 32px;
    border: 1.5px solid #d9dbde;
    border-radius: 16px;
    background: #fff;
    &:hover {
      border-color: #8187a5;
    }
  }

  .dropdown-toggle-label {
    margin-left: 24px;
    height: 100%;
    display: flex;
    align-items: center;
    color: #1d213c;
    font-size: 13px;
    font-weight: 500;
  }

  .dropdown-toggle-indicator {
    position: absolute;
    top: 11px;
    right: 14px;
    background: url("../../static/dropdown-indicator.svg");
    background-size: 12px 7px;
    width: 12px;
    height: 7px;
  }
}

.network-list {
  list-style: none;

  li {
    margin: 0;
  }
}

.dropdown-header {
  color: #fff;
  font-size: 16px;
  margin: 9px 16px;
  text-align: center;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;

  i {
    width: 100%;
    font-style: normal;
  }

  .logout-btn {
    height: 32px;
    box-sizing: border-box;
    border: 2px solid rgba(255, 255, 255, 0.5);
    padding: 0 14px;
    border-radius: 6px;
    cursor: pointer;
    line-height: 28px;
    font-size: 14px;
    &:hover {
      border-color: rgba(255, 255, 255, 0.8);
    }
  }
}

.menu-separator {
  width: 100%;
  height: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.menu-item {
  cursor: pointer;
  padding: 14px 44px;
  color: #fff;
  &.create {
    background: url("../../static/ca.svg") no-repeat 16px center;
    background-size: 18px;
  }
  &.import {
    background: url("../../static/ia.svg") no-repeat 16px center;
    background-size: 18px;
  }
  &.about {
    background: url("../../static/au.svg") no-repeat 16px center;
    background-size: 18px;
  }
  &.setting {
    background: url("../../static/su.svg") no-repeat 16px center;
    background-size: 18px;
  }
}

.network-list {
  .defult-network {
    padding: 14px 16px 13px;
    line-height: 18px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 13px;
  }
  .network-item {
    padding: 11px 0 11px 45px;
    height: 19px;
    color: rgba(255, 255, 255, 0.5);
    font-weight: 500;
    background: url("../../static/select.svg") no-repeat 16px center;
    background-size: 17px;
    &:hover {
      color: #fff;
    }

    &.active {
      background-image: url("../../static/select-active.svg");
      color: #fff;
    }
  }
}

.social-icon-container {
  height: 36px;
  margin: 16px;

  .social-icon {
    width: 36px;
    height: 36px;
    margin-right: 30px;
  }

  .wechat-link {
    display: inline-block;
    position: relative;

    .wechat-img {
      display: none;
      width: 120px;
      height: 120px;
    }

    &:hover .wechat-img {
      display: inline-block;
      position: absolute;
      top: -128px;
      left: 0;
    }
  }
}

.account-list {
  list-style: none;
  margin: 0;

  .account-item {
    padding: 12px 44px;
    cursor: pointer;
    line-height: 24px;
    margin: 0;
    color: rgba(255, 255, 255, 0.5);
    font-size: 15px;
    font-weight: 500;
  }

  .account-item.active {
    color: #fff;
    background: url("../../static/account-selected.svg") no-repeat 16px center;
    background-size: 16px 11px;
  }
}
</style>