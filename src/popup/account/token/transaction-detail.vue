<template>
  <div class="transaction-detail">
    <nav-layout :title="$t('common.txDetail')">
      <div class="datail-wrap">
        <div class="icon"></div>
        <div
          class="amount"
          v-if="info.txtype !== 'DEX_CANCEL_ORDER_TX' && info.txtype !== 'DEX_MARKET_BUY_ORDER_TX' && info.txtype !== 'DEX_MARKET_SELL_ORDER_TX'"
        >{{+trans.trandirection === 1 ? "-" : +trans.trandirection === 2 ? "+" : ""}}{{getAmount()}} {{info.txtype && info.txtype.indexOf('SELL_ORDER') > -1 ? info.assetsymbol : info.coinsymbol}}</div>
        <div class="status">{{$t("common.success")}}</div>
        <div class="info-list no-scrollbar">
          <ul class="address-info-list">
            <li>
              <span class="label">{{$t('account.transDetail.txTypeLabel')}}</span>
              <span
                class="value type"
              >{{info.txtype === "CDP_STAKE_TX" ? info.txid === info.cdptxid ? formatNewTxType(info.txtype) : $t('window.cdp.addtional') : formatNewTxType(info.txtype)}}</span>
            </li>
            <li>
              <span class="label">{{$t('account.transDetail.confirmedTimeLabel')}}</span>
              <span class="value">{{formatDate(info.confirmedtime * 1000)}}</span>
            </li>
            <li>
              <span class="label">{{$t('account.transDetail.hashLabel')}}</span>
              <a
                class="value need-copy"
                :href="`${scanHost(info.txid)}${info.txid}`"
                target="_blank"
              >{{cutMiddleStr(info.txid, 10)}}</a>
            </li>
            <li v-if="!isDEX(info.txtype) && !isCDP(info.txtype)">
              <span
                class="label"
                v-if="info.txtype === 'ASSET_ISSUE_TX' || info.txtype === 'ASSET_UPDATE_TX'"
              >{{$t('window.cdp.ownerAddr')}}</span>
              <span class="label" v-else>{{$t('account.sendToken.fromLabel')}}</span>
              <a
                class="value need-copy"
                :href="`${scanHost(info.fromaddr)}${info.fromaddr}`"
                target="_blank"
              >{{cutMiddleStr(info.fromaddr, 10)}}</a>
            </li>
            <li v-if="!isDEX(info.txtype) && !isCDP(info.txtype) && info.toaddr">
              <span class="label">{{$t('account.sendToken.destLabel')}}</span>
              <a
                class="value need-copy"
                :href="`${scanHost(info.toaddr)}${info.toaddr}`"
                target="_blank"
              >{{cutMiddleStr(info.toaddr, 10)}}</a>
            </li>
            <li>
              <span class="label">{{$t('account.transDetail.feesLabel')}}</span>
              <span class="value">{{new Decimal(info.fees).dividedBy(100000000)}} {{info.feesymbol}}</span>
            </li>
          </ul>
          <ul class="address-info-list is-cdp" v-if="isCDP(info.txtype)">
            <!-- CDP_STAKE_TX -->
            <li v-if="info.txtype === 'CDP_STAKE_TX' && (info.txid !== info.cdptxid)">
              <span class="label">{{$t('account.transDetail.cdpid')}}</span>
              <a
                class="value need-copy"
                :href="`${scanHost(info.cdptxid)}${info.cdptxid}`"
                target="_blank"
              >{{cutMiddleStr(info.cdptxid, 10)}}</a>
            </li>
            <li v-if="info.txtype === 'CDP_STAKE_TX'">
              <span
                class="label"
              >{{info.txid === info.cdptxid ? $t('window.cdp.dyl') : $t('window.cdp.zjdyl') }}</span>
              <span
                class="value"
                v-for="key in Object.keys(info.assetstostake)"
                :key="key"
              >{{formatAmount(info.assetstostake[key], 8)}} {{key}}</span>
            </li>
            <li v-if="info.txtype === 'CDP_STAKE_TX'">
              <span
                class="label"
              >{{info.txid === info.cdptxid ? $t('window.cdp.dcl') : $t('window.cdp.zjdcl')}}</span>
              <span class="value">{{formatAmount(info.scoinstomint, 8)}} {{info.scoinsymbol}}</span>
            </li>
            <!-- CDP_REDEEM_TX -->
            <li v-if="info.txtype === 'CDP_REDEEM_TX'">
              <span class="label">{{$t('window.cdp.creator')}}</span>
              <a
                class="value need-copy"
                :href="`${scanHost(info.fromaddr)}${info.fromaddr}`"
                target="_blank"
              >{{cutMiddleStr(info.fromaddr, 10)}}</a>
            </li>
            <li v-if="info.txtype === 'CDP_REDEEM_TX'">
              <span class="label">{{$t('account.transDetail.cdpid')}}</span>
              <a
                class="value need-copy"
                :href="`${scanHost(info.cdptxid)}${info.cdptxid}`"
                target="_blank"
              >{{cutMiddleStr(info.cdptxid, 10)}}</a>
            </li>
            <li v-if="info.txtype === 'CDP_REDEEM_TX'">
              <span class="label">{{$t('window.cdp.ghl')}}</span>
              <span class="value">{{formatAmount(info.scoinstorepay, 8)}} WUSD</span>
            </li>
            <li v-if="info.txtype === 'CDP_REDEEM_TX'">
              <span class="label">{{$t('window.cdp.shl')}}</span>
              <span
                class="value"
                v-for="key in Object.keys(info.assetstoredeem)"
                :key="key"
              >{{formatAmount(info.assetstoredeem[key], 8)}} {{key}}</span>
            </li>
            <!-- CDP_LIQUIDATE_TX -->
            <li v-if="info.txtype === 'CDP_LIQUIDATE_TX'">
              <span class="label">{{$t('window.cdp.creator')}}</span>
              <a
                class="value need-copy"
                :href="`${scanHost(info.fromaddr)}${info.fromaddr}`"
                target="_blank"
              >{{cutMiddleStr(info.fromaddr, 10)}}</a>
            </li>
            <li v-if="info.txtype === 'CDP_LIQUIDATE_TX'">
              <span class="label">{{$t('account.transDetail.cdpid')}}</span>
              <a
                class="value need-copy"
                :href="`${scanHost(info.cdptxid)}${info.cdptxid}`"
                target="_blank"
              >{{cutMiddleStr(info.cdptxid, 10)}}</a>
            </li>
            <li v-if="info.txtype === 'CDP_LIQUIDATE_TX'">
              <span class="label">{{$t('window.cdp.qsl')}}</span>
              <span class="value">{{formatAmount(info.scoinstoliquidate, 8)}} WUSD</span>
            </li>
          </ul>
          <ul
            class="address-info-list is-dex"
            v-if="isDEX(info.txtype) && info.txtype !== 'DEX_CANCEL_ORDER_TX'"
          >
            <li>
              <span class="label">{{$t('window.cdp["成交量"]')}}</span>
              <span class="value" v-if="info.txtype === 'DEX_MARKET_BUY_ORDER_TX'">{{this.$t('window.cdp.sjcjwz')}}</span>
              <span class="value" v-else-if="info.txtype === 'DEX_MARKET_SELL_ORDER_TX'">{{this.$t('window.cdp.sjcjwz')}}</span>
              <span class="value" v-else-if="info.txtype === 'DEX_LIMIT_SELL_ORDER_TX'">{{fixed(formatAmount(info.assetamount, 8) * formatAmount(info.price, 8), 8)}} {{info.coinsymbol}}</span>
              <span class="value" v-else-if="info.txtype === 'DEX_LIMIT_BUY_ORDER_TX'">{{formatAmount(info.assetamount, 8)}} {{info.assetsymbol}}</span>
            </li>
            <li>
              <span class="label">{{$t('window.cdp["成交价"]')}}</span>
              <span
                class="value"
                v-if="info.txtype === 'DEX_LIMIT_BUY_ORDER_TX'"
              >{{formatAmount(info.price, 8)}} {{info.coinsymbol}}</span>
              <span
                class="value"
                v-if="info.txtype === 'DEX_LIMIT_SELL_ORDER_TX'"
              >{{formatAmount(info.price, 8)}} {{info.coinsymbol}}</span>
              <span
                class="value"
                v-if="info.txtype === 'DEX_MARKET_BUY_ORDER_TX' || info.txtype === 'DEX_MARKET_SELL_ORDER_TX'"
              >{{this.$t('window.cdp.sjcjwz')}}</span>
            </li>
            <li>
              <span class="label">{{$t('window.cdp["成交总额"]')}}</span>
              <span class="value" v-if="info.txtype === 'DEX_MARKET_BUY_ORDER_TX'">{{formatAmount(info.coinamount,8)}} {{info.coinsymbol}}</span>
              <span class="value" v-else-if="info.txtype === 'DEX_MARKET_SELL_ORDER_TX'">{{formatAmount(info.assetamount, 8)}} {{info.assetsymbol}}</span>
              <span class="value" v-else-if="info.txtype === 'DEX_LIMIT_SELL_ORDER_TX'">{{formatAmount(info.assetamount, 8)}} {{info.assetsymbol}}</span>
              <span class="value" v-else-if="info.txtype === 'DEX_LIMIT_BUY_ORDER_TX'">{{formatAmount(new Decimal(info.price).times(formatAmount(info.assetamount, 8)),8)}} {{info.coinsymbol}}</span>
            </li>
          </ul>
          <ul
            class="address-info-list is-dex"
            v-if="isDEX(info.txtype) && info.txtype === 'DEX_CANCEL_ORDER_TX'"
          >
            <li>
              <span class="label">{{$t('window.cdp.ddh')}}</span>
              <a
                class="value need-copy"
                :href="`${scanHost(info.orderid)}${info.orderid}`"
                target="_blank"
              >{{cutMiddleStr(info.orderid, 10)}}</a>
            </li>
          </ul>
          <ul
            class="address-info-list is-dex"
            v-if="info.txtype == 'ASSET_UPDATE_TX' || info.txtype == 'ASSET_ISSUE_TX'"
          >
            <li>
              <span class="label">{{$t('window.assets.dbjc')}}</span>
              <span class="value">{{info.assetsymbol}}</span>
            </li>
            <li>
              <span class="label">{{$t('window.assets.dbqc')}}</span>
              <span class="value">{{info.assetname || assetname}}</span>
            </li>
            <li>
              <span class="label">{{$t('window.assets.zfxl')}}</span>
              <span
                class="value"
              >{{formatAmount(info.totalsupply || totalsupply, 8)}} {{info.assetsymbol}}</span>
            </li>
            <li>
              <span class="label">{{$t('window.assets.dbcyz')}}</span>
              <a
                class="value need-copy"
                :href="`${scanHost(info.owneraddr)}${info.owneraddr}`"
                target="_blank"
              >{{cutMiddleStr(info.owneraddr || owneraddr, 10)}}</a>
            </li>
            <!-- <li>
              <span class="label">{{$t('window.assets.kfzf')}}</span>
              <span
                class="value"
              >{{info.mintable || mintable ? $t('window.assets.s') : $t('window.assets.f')}}</span>
            </li> -->
          </ul>
        </div>
      </div>
    </nav-layout>
  </div>
</template>

<script>
import NavLayout from "../../components/nav-layout";
import transUtil from "../components/trans-util";
import Decimal from "decimal.js";
import API from "../../api";
import fixed from '../../api/fixed'
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
Vue.use(VueClipboard);
export default {
  data() {
    return {
      trans: JSON.parse(this.$route.query.info),
      info: {},
      Decimal: Decimal,
      assetname: "",
      owneraddr: "",
      totalsupply: "",
      network: localStorage.getItem('network'),
      myselfNetWork: localStorage.getItem('myselfNetWork')
    };
  },
  components: {
    NavLayout
  },
  mounted() {
    const route = this.$router.currentRoute;
    API.callRaw("getDetailInfo", { info: { hash: this.trans.txid } }).then(
      res => {
        this.info = res;
        // alert(JSON.stringify(res));
        if (res.txtype === "ASSET_UPDATE_TX") {
          this.getAssetInfo(res.assetsymbol);
        }
      },
      error => {
        console.log(error.message);
        this.$loading.close();
        this.$toast(this.$t(error.message), {
          type: "center",
          duration: 5000,
          wordWrap: true
        });
      }
    );

    window.onunload = () => {
      localStorage.setItem(
        "WICC_RESTORE_PATH",
        JSON.stringify({
          name: route.name,
          query: {
            ...(route.query || {})
          }
        })
      );
    };
  },
  destroyed() {
    window.onunload = null;
  },
  methods: {
    formatNewTxType: transUtil.formatNewTxType,
    formatAmount: transUtil.formatAmount,
    formatDate: transUtil.formatTime,
    fixed: fixed,
    scanHost(str) {
      //https://testnet.waykiscan.com/#/address/
      //https://www.waykiscan.com/#/address/
      //https://testnet.waykiscan.com/#/txhash/
      //https://www.waykiscan.com/#/txhash/
      if (this.network === 'testnet' || this.myselfNetWork) {
        if (str.length === 34) {
          return 'https://testnet.waykiscan.com/#/address/'
        } else {
          return 'https://testnet.waykiscan.com/#/txhash/'
        }
      }
      if (this.network === 'mainnet' || (!this.network && !this.myselfNetWork)) {
        if (str.length === 34) {
          return 'https://www.waykiscan.com/#/address/'
        } else {
          return 'https://www.waykiscan.com/#/txhash/'
        }
      }
    },
    isDEX(type) {
      type = type.toLowerCase();
      return type.indexOf("dex") > -1;
    },
    isCDP(type) {
      type = type.toLowerCase();
      return type.indexOf("cdp") > -1;
    },
    onCopy() {
      this.$toast(this.$t("common.copySuccess"), {
        type: "center",
        duration: 1000
      });
    },
    onError: function(e) {
      alert("Failed to copy texts");
    },
    getAssetInfo(assetSymbol) {
      let param = {
        assetSymbol: assetSymbol
      };
      API.callRaw("getAssetInfo", { info: param }).then(
        res => {
          this.assetname = res.assetname;
          this.owneraddr = res.owneraddr;
          this.totalsupply = res.totalsupply / Math.pow(10, 8);
          this.mintable = res.mintable;
        },
        error => {
          this.$toast(error.message, {
            type: "center",
            duration: 5000,
            wordWrap: true
          });
          this.$loading.close();
        }
      );
    },
    getAmount() {
      let trans = this.info;
      if (trans.txtype == "CDP_LIQUIDATE_TX") {
        return fixed(trans.scoinstoliquidate / Math.pow(10, 8),8);
      }
      if (trans.txtype == "CDP_STAKE_TX") {
        return fixed(trans.assetstostake.WICC / Math.pow(10, 8),8);
      }
      if (trans.txtype == "CDP_REDEEM_TX") {
        return fixed(trans.scoinstorepay / Math.pow(10, 8),8);
      }
      if (trans.txtype == "ASSET_UPDATE_TX") {
        return 110;
      }
      if (trans.txtype == "ASSET_ISSUE_TX") {
        return 550;
      }
      if (trans.txtype.indexOf("DEX") > -1) {
        if (trans.txtype.indexOf("DEX_LIMIT_SELL") > -1) {
          const amount = trans.assetamount
            ? trans.assetamount
            : trans.coinamount;
          return fixed(amount / Math.pow(10, 8),8);
        }
        if (trans.txtype.indexOf("DEX_MARKET") > -1) {return 0}
        const amount = trans.assetamount ? trans.assetamount : trans.coinamount;
        const res = fixed((amount * trans.price) / Math.pow(10, 16),8);
        return res;
      }

      return trans.coinamount / Math.pow(10, 8);
    },
    getSymbol() {},
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

<style lang="scss">
.transaction-detail {
  .layout-body {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .icon {
    width: 44px;
    height: 44px;
    background: url("../../static/success-transaction.svg");
    background-size: cover;
    margin: auto;
    margin-top: 28px;
    overflow: hidden;
    margin-bottom: 12px;
  }
  .amount {
    line-height: 32px;
    color: #1d213c;
    font-size: 24px;
    text-align: center;
    font-weight: 500;
  }
  .status {
    line-height: 22px;
    margin-top: 2px;
    font-size: 16px;
    color: #8187a5;
    text-align: center;
    margin-bottom: 30px;
  }
  .info-list {
    height: 358px;
    padding: 22px 24px 0;
    border-top: 1px solid #f0f3f7;
    overflow: auto;
    box-sizing: border-box;
  }
  .address-info-list {
    margin-bottom: 30px;
    li {
      margin: 0;
      padding: 6px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 20px;
      font-size: 14px;
    }
    .label {
      color: #8187a5;
    }
    .value {
      color: #21254a;
    }
    .type {
      font-weight: 500;
    }
    .need-copy {
      color: #062deb;
      cursor: pointer;
    }
  }
  .is-cdp,
  .is-dex {
    border-top: 1px solid #f0f3f7;
    padding-top: 30px;
    margin-bottom: 20px;
  }
}
</style>