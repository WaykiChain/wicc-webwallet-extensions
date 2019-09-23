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
      <ul class="token-list">
        <li
          class="token-item"
          :class="{
            active: activeRegId === null
          }"
          @click="handleItemClick({num:wicc?wicc.freeAmount/100000000:0,name:'WICC'})"
        >
          <img class="token-item-icon" src="../../static/wicclogo.svg" />
          <span class="token-item-name">WICC</span>
          <span>{{wicc ? wicc.freeAmount/100000000 : 0}}</span>
        </li>
        <li
          class="token-item"
          :class="{
            active: activeRegId === null
          }"
          @click="handleItemClick({num:wusd ?wusd.freeAmount/100000000:0,name:'WUSD'})"
        >
          <img class="token-item-icon" src="../../static/wicclogo.svg" />
          <span class="token-item-name">WUSD</span>
          <span>{{wusd ? wusd.freeAmount/100000000 : 0}}</span>
        </li>
        <li
          class="token-item"
          :class="{
            active: activeRegId === null
          }"
          @click="handleItemClick({num:wgrt?wgrt.freeAmount/100000000:0,name:'WGRT'})"
        >
          <img class="token-item-icon" src="../../static/wicclogo.svg" />
          <span class="token-item-name">WGRT</span>
          <span>{{wgrt ? wgrt.freeAmount/100000000 : 0}}</span>
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
          <img class="token-item-icon" src="../../static/coin-icon.svg" />
          <span class="token-item-name">{{ token.name }}</span>
          <!-- <span class="token-item-more-btn">
            <span class="token-item-remove-btn" @click.stop="handleRemoveToken(token)">{{ $t('account.main.removeToken') }}</span>
          </span>-->
        </li>
      </ul>
    </div>
    <div class="token-list-bottom">
      <button class="token-list-btn-add" @click="gotoAddToken">
        <img src="../../static/coin-add-icon.svg" />
        {{ $t('account.main.addTokenButton') }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.token-list-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  padding-top: 20px;
}

.token-list-container {
  flex: 1 0 0;
  overflow-y: auto;
  padding: 0 20px;
}
.myzichan {
  margin-bottom: 0;
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
}

.token-item {
  display: flex;
  flex-direction: row;
  padding: 16px 0;
  align-items: center;
  border-bottom: 1px solid rgba(180, 188, 204, 0.3);
  cursor: pointer;
}

.token-item.active {
  // color: #3C78EA;
  font-weight: bold;
}

.token-item-icon {
  width: 30px;
  margin-right: 8px;
}

.token-item-name {
  font-weight: 400;
  font-size: 16px;
  margin-right: 8px;
  flex: 1 0 0;
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
import CopyMixin from "../../components/copy-mixin";
import API from "../../api";
import axios from "axios";
export default {
  name: "token-list",

  mixins: [CopyMixin],

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
      console.log('监听到的地址',val)
      this.getWiccNum(val);
    }
  },
  methods: {
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
      API.getAccountInfo(this.network, address).then(
        res => {
          console.log(res)
          let tokens = res.tokens;
          if (tokens){
            this.wusd = tokens.WUSD;
            this.wicc = tokens.WICC;
            this.wgrt = tokens.WGRT;
          }else{
            this.wusd = null;
            this.wicc = null;
            this.wgrt = null;
          }
          
        },
        error => {
          console.log(error)
          this.$toast(error.message, {
            type: "center"
          });
        }
      );
    }
  },

  data() {
    return {
      activeToken: null,
      clipboardSelector: ".address-btn-copy",
      wusd: null,
      wicc: null,
      wgrt: null
    };
  }
};
</script>
