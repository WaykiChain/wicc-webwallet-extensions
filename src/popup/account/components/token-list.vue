<template>
  <div class="token-list-wrapper">
    <div class="account-info" hidden>
      <div class="account-info-basic">
        <img src="../../static/account-icon.svg" />
        <div
          class="account-info-name"
        >{{ $t('common.accountLabel') }} {{ activeAccount ? activeAccount.index + 1 : 1 }}</div>
      </div>
      <div class="account-address-wrapper" v-show="activeAddress">
        <span class="account-address">{{ activeAddress }}</span>
        <button class="address-btn-copy"></button>
      </div>
    </div>
    <div class="token-list-container">
      <p class="myzichan">{{$t('window.cdp.wdzc')}}</p>
      <div class="line"></div>
      <ul class="token-list">
        <li
          class="token-item"
          :class="{
            active: activeRegId === null
          }"
          v-for="tokenKey in ['WICC','WUSD','WGRT']"
          :key="tokenKey"
          @click="handleItemClick({num:myAssets[tokenKey] ? myAssets[tokenKey].freeAmount/Math.pow(10,8) : 0,name:tokenKey, value: tokenKey === 'WGRT' ? '' : getCurrencyAmount(myAssets[tokenKey])})"
        >
          <div class="list-wrap">
            <img class="token-item-icon" :src="getIcon(tokenKey)" />
            <span class="token-item-name">{{tokenKey}}</span>
            <div class="token-amount">
              <div
                class="token-amount-num"
              >{{myAssets[tokenKey] ? myAssets[tokenKey].freeAmount/Math.pow(10,8) > 0.000001 ? myAssets[tokenKey].freeAmount/Math.pow(10,8) : (myAssets[tokenKey].freeAmount/Math.pow(10,8)).toFixed(8) : 0}}</div>
              <div
                class="token-worth"
                v-if="myAssets[tokenKey]"
              >{{getCurrencyAmount(myAssets[tokenKey])}}</div>
            </div>
          </div>
        </li>

        <li
          class="token-item"
          :class="{
            active: activeRegId === null
          }"
          v-for="tokenKey in tokensKeys"
          :key="tokenKey"
          @click="handleItemClick({num:myAssets[tokenKey].freeAmount/Math.pow(10,8),name:tokenKey})"
        >
          <div class="list-wrap">
            <img class="token-item-icon" :src="getIcon('WICC')" />
            <span class="token-item-name">{{tokenKey}}</span>
            <div class="token-amount">
              <div
                class="token-amount-num"
              >{{myAssets[tokenKey] ? myAssets[tokenKey].freeAmount/Math.pow(10,8) > 0.000001 ? myAssets[tokenKey].freeAmount/Math.pow(10,8) : (myAssets[tokenKey].freeAmount/Math.pow(10,8)).toFixed(8) : 0}}</div>
              <div class="token-worth"></div>
            </div>
          </div>
        </li>
        <li
          class="token-item"
          v-for="(token, index) in visibleTokens"
          :key="index"
          @click="handleItemClick(token)"
          :class="{
            active: activeRegId === token.regId
          }"
        >
          <div class="list-wrap">
            <img class="token-item-icon" src="../../static/coin-icon.svg" />
            <span class="token-item-name">{{ token.name }}</span>
            <span class="token-item-more-btn">
              <span
                class="token-item-remove-btn"
                @click.stop="handleRemoveToken(token)"
              >{{ $t('account.main.removeToken') }}</span>
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.token-list-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
}

.token-list-container {
  flex: 1 0 0;
  display: flex;
  flex-direction: column;
}
.myzichan {
  margin-bottom: 12px;
  font-size: 16px;
  color: #1d213c;
  line-height: 24px;
  font-weight: 500;
  padding: 0 20px;
}
.line {
  width: 500%;
  height: 0;
  border-bottom: 1px solid #f0f3f7;
  margin-left: -100%;
}
.account-info-basic {
  text-align: center;
}

.account-info-basic img {
  width: 60px;
  height: 60px;
}

.account-info-name {
  font-size: 16px;
  font-weight: 400;
}

.account-address-wrapper {
  display: flex;
  flex-direction: row;
  border: 1px solid #c6cede;
  background-color: #f2f5fc;
  border-radius: 3px;
  margin: 16px 16px 0 16px;
  overflow: hidden;
  height: 48px;
  box-sizing: border-box;
}

.account-address {
  font-size: 13px;
  color: #5b5f67;
  flex: 1 100%;
  text-overflow: ellipsis;
  line-height: 48px;
  overflow: hidden;
  padding-left: 10px;
}

.address-btn-copy {
  display: inline-block;
  border: none;
  padding: 0;
  margin: 0;
  flex: 1 0 32px;
  width: 32px;
  background: url("../../static/copy-icon-blue.svg") center center no-repeat;
  background-size: 16px 17px;
}

.token-list-bottom {
  text-align: center;
  height: 63px;
  line-height: 63px;
  width: 100%;
  background: rgba(242, 245, 252, 1);
}

.token-list-btn-add {
  border: none;
  color: #3c78ea;
  font-size: 16px;
}

.token-list-btn-add img {
  position: relative;
  width: 15px;
  height: 15px;
  top: 3px;
}

.token-list {
  list-style: none;
  overflow-y: auto;
  flex: 1 0 0;
  margin-bottom: 0;
}

.token-item {
  padding: 0 20px;
  cursor: pointer;
  margin: 0;
  &:hover {
    background-color: #fafbfc;
  }
}

.list-wrap {
  display: flex;
  align-items: center;
  padding-bottom: 22px;
  padding-top: 23px;
  border-bottom: 1px solid #f0f3f7;
}

.token-item.active {
  // color: #3C78EA;
  font-weight: bold;
}

.token-item-icon {
  width: 40px;
  height: 40px;
  margin-right: 12px;
}

.token-item-name {
  font-weight: 500;
  font-size: 17px;
  color: #8187a5;
  width: 86px;
}

.token-amount {
  flex: 1;
  text-align: right;
}

.token-amount-num {
  line-height: 21px;
  font-size: 16px;
  color: #1d213c;
  font-weight: 500;
  margin-bottom: 3px;
}

.token-worth {
  line-height: 18px;
  font-size: 13px;
  color: #8187a5;
}

.token-item-more-btn {
  position: relative;
  width: 40px;
  height: 39px;
  background: url("../../static/more-icon.svg") right center no-repeat;
  background-size: 20px 4px;

  &:hover .token-item-remove-btn {
    display: inline-block;
  }

  .token-item-remove-btn {
    display: none;
    background: rgba(70, 74, 83, 0.95);
    position: absolute;
    right: 0;
    top: 30px;
    padding-left: 15px;
    width: 128px;
    height: 42px;
    box-sizing: border-box;
    line-height: 42px;
    font-size: 14px;
    color: white;
  }
}
</style>

<script type="text/jsx">
// import CopyMixin from "../../components/copy-mixin";
import API from "../../api";
import axios from "axios";
import eventBus from "../bus";
import Decimal from "decimal.js";

export default {
  name: "token-list",

  // mixins: [CopyMixin],

  props: {
    activeRegId: {
      type: String
    },
    activeAccount: {
      type: Object
    },
    activeAddress: {
      type: String,
      default: ""
    },
    network: {
      type: String
    },
    tokens: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  computed: {
    visibleTokens() {
      const network = this.network;
      const tokens = this.tokens;
      return tokens.filter(token => {
        const tokenNetwork = token.network || "testnet";
        return tokenNetwork === network;
      });
    }
  },
  watch: {
    activeAddress(val) {
      console.log("监听到的地址", val);
      this.getWiccNum(val);
      this.currentAddr = val;
      const localNet = localStorage.getItem("network");
      if (localNet) {
        return;
      }
      localStorage.setItem("network", this.localNet);
    }
  },

  created() {
    this.eventBus.$on("on-refresh", this.handleChange);
  },

  destroyed() {
    this.eventBus.$off("network-change", this.handleChange);
  },

  methods: {
    getIcon(key) {
      return require(`../../static/${
        key === "WICC" ? "wicclogo" : key.toLowerCase()
      }.svg`);
    },
    getCurrencyAmount(asset) {
      let prefix = this.currency === "CNY" ? "≈￥" : "≈$";
      if (!asset) return prefix + " 0";
      let result = "";
      let amount = asset
        ? asset.freeAmount / Math.pow(10, 8) > 0.000001
          ? asset.freeAmount / Math.pow(10, 8)
          : (asset.freeAmount / Math.pow(10, 8)).toFixed(8)
        : 0;
      if (this.currency === "CNY") {
        result = new Decimal(amount * asset.rmbPrice)
          .times(100)
          .floor()
          .dividedBy(100)
          .toString();
      } else {
        result = new Decimal(amount * asset.usdtPrice)
          .times(100)
          .floor()
          .dividedBy(100)
          .toString();
      }
      if (!result.split(".")[1]) {
        result += ".00";
      }
      if (result.split(".")[1].length < 2) {
        result += "0";
      }
      return prefix + " " + result;
    },
    handleChange() {
      this.getWiccNum(this.activeAddress);
    },
    gotoAddToken() {
      this.$router.push({
        name: "addToken"
      });
    },

    getCopyText() {
      return this.activeAddress;
    },

    handleItemClick(token) {
      this.activeToken = token;
      this.$emit("active-token-change", token);
    },

    handleRemoveToken(token) {
      const index = token.index;
      API.removeToken(this.activeAccount.id, index).then(
        () => {
          const token = this.tokens[index];
          this.tokens.splice(index, 1);
          if (token && token.regId === this.activeRegId) {
            this.activeToken = null;
            this.$emit("active-token-change", null);
          }

          this.$toast(this.$t("account.main.removeTokenSuccess"), {
            type: "center"
          });
        },
        error => {
          this.$toast(this.$t("account.main.removeTokenFailed"), {
            type: "center"
          });
        }
      );
    },
    getWiccNum(address) {
      this.wusd = null;
      this.wicc = null;
      this.wgrt = null;
      this.myAssets = {};
      this.$loading(this.$t("window.cdp.hqzcz"));
      API.getAccountInfo(this.network, address).then(
        res => {
          this.$loading.close();
          let tokens = res.tokens;
          localStorage.setItem("srcRegID", res.regid ? res.regid : "");
          if (tokens) {
            this.sortAssets(tokens);
            this.myAssets = tokens;
            this.wusd = tokens.WUSD;
            this.wicc = tokens.WICC;
            this.wgrt = tokens.WGRT;
          } else {
            this.myAssets = {};
            this.wusd = null;
            this.wicc = null;
            this.wgrt = null;
          }
          this.eventBus.$emit("on-assets-update", this.myAssets);
        },
        error => {
          this.$loading.close();
          console.log(error);
          this.$toast(error.message, {
            type: "center"
          });
        }
      );
    },

    sortAssets(tokens) {
      let keys = Object.keys(tokens);
      if (keys.length > 0) {
        const a = keys.filter(ele => {
          return ["WICC", "WUSD", "WGRT"].indexOf(ele) < 0;
        });
        this.tokensKeys = a;
      } else {
        this.tokensKeys = [];
      }
    }
  },

  data() {
    return {
      currentAddr: "",
      activeToken: null,
      clipboardSelector: ".address-btn-copy",
      wusd: null,
      wicc: null,
      wgrt: null,
      eventBus,
      myAssets: {},
      tokensKeys: [],
      lastNetWork: localStorage.getItem("tempNetWork"),
      currency: localStorage.getItem("currency") || "CNY"
    };
  }
};
</script>
