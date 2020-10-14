<template>
  <div class="trans-history">
    <trans-detail
      :visible.sync="transDetailVisible"
      :detail="currentTrans"
    ></trans-detail>
    <div
      class="wrap"
      v-if="transactions && transactions.length > 0"
    >
      <ul class="trans-list">
        <li
          class="trans-item"
          @click="handleClick(trans)"
          v-for="(trans, index) in transactions"
          :key="index"
        >
          <div class="list-wrap">
            <div class="first-row">
              <span
                class="trans-type"
                v-if="trans.txtype=='CDP_STAKE_TX'"
              >{{trans.txid === trans.cdptxid ? formatNewTxType(trans.txtype) : $t('window.cdp.addtional') }}</span>
              <span
                class="trans-type"
                v-else
              >{{formatNewTxType(trans.txtype)}}</span>
              <span class="trans-amount">{{showCell(trans) ? showTrandirection(trans.trandirection) : ''}} {{getCount(trans)}} {{showCell(trans)? trans.coinsymbol : ''}}</span>
            </div>
            <div class="second-row">
              <span class="trans-time">{{ formatTime(trans.confirmedtime * 1000) }}</span>
              <span class="trans-status">{{ formatStatus(trans) }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div
      v-else
      class="empty-block"
      v-show="showEmptyBlock"
    >{{ $t('account.transHistory.emptyBlock') }}</div>
  </div>
</template>

<script>
import TransDetail from "./trans-detail";
import transUtil from "./trans-util";

export default {
  name: "account-trans-history",

  props: {
    transactions: {
      type: Array,
    },
    showEmptyBlock: {
      type: Boolean,
      defaultValue: true,
    },
  },

  components: {
    TransDetail,
  },

  methods: {
    formatNewTxType: transUtil.formatNewTxType,

    formatTime: transUtil.formatTime,

    formatAmount: transUtil.formatAmount,

    formatStatus: transUtil.formatStatus,

    cutMiddleStr: transUtil.cutMiddleStr,

    handleClick(trans) {
      this.currentTrans = trans;
      // this.transDetailVisible = true;
      this.$router.push({
        name: "transactionDetail",
        query: {
          info: JSON.stringify(this.currentTrans),
        },
      });
    },
    showTrandirection(trandirection) {
      if (trandirection == 1) {
        return "-";
      } else if (trandirection == 2) {
        return "+";
      } else {
        return "";
      }
    },
    showMoney(trans) {
      if (trans.txtype.indexOf("DEX_LIMIT") > -1) {
        return true;
      }
      return false;
    },
    showCell(trans) {
      if (
        trans.txtype.indexOf("DEX_MARKET") > -1 ||
        trans.txtype == "DEX_CANCEL_ORDER_TX"
      ) {
        return false;
      }
      return true;
    },
    getCount(trans) {
      if (trans) {
        // if (trans.txtype == "CDP_LIQUIDATE_TX") {
        //   return trans.scoinstoliquidate / Math.pow(10, 8);
        // }
        // if (trans.txtype == "CDP_STAKE_TX") {
        //   if (trans.assetstostake instanceof Object) {
        //     return trans.assetstostake.WICC / Math.pow(10, 8);
        //   }
        // }
        // if (trans.txtype == "CDP_REDEEM_TX") {
        //   return trans.scoinstorepay / Math.pow(10, 8);
        // }
        if (trans.txtype == "ASSET_UPDATE_TX") {
          return 110;
        }
        if (trans.txtype == "ASSET_ISSUE_TX") {
          return 550;
        }
        if (trans.txtype.indexOf("DEX") > -1) {
          if (this.showMoney(trans)) {
            if (trans.txtype.indexOf("DEX_LIMIT_SELL") > -1) {
              const amount = trans.assetamount
                ? trans.assetamount
                : trans.coinamount;
              return amount / Math.pow(10, 8);
            }
            const amount = trans.assetamount
              ? trans.assetamount
              : trans.coinamount;
            const res = (amount * trans.price) / Math.pow(10, 16);
            return res;
          }
          return "";
        }
      }

      return trans.coinamount / Math.pow(10, 8);
    },
  },

  data() {
    return {
      transDetailVisible: false,
      currentTrans: {},
    };
  },
};
</script>

<style lang="scss" scoped>
.empty-block {
  text-align: center;
  margin-top: 20px;
}

.trans-list {
  list-style: none;
  margin: 0;
}

.trans-item {
  cursor: pointer;
  padding: 0 20px;
  margin: 0;

  &:hover {
    background-color: #fafbfc;
  }

  .list-wrap {
    padding-top: 14px;
    padding-bottom: 14px;
    border-bottom: 1px solid #f0f3f7;
  }

  .first-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 14px;
    line-height: 19px;
    margin-bottom: 4px;
  }

  .second-row {
    line-height: 16px;
  }

  .trans-hash {
    text-overflow: ellipsis;
    overflow: hidden;
    flex: 1 0 0;
    margin-right: 12px;
    color: #5b5f67;
    font-size: 15px;
  }

  .trans-amount {
    color: #21264a;
    font-size: 14px;
  }

  .trans-time,
  .trans-status {
    color: #b3b7c9;
    font-size: 12px;
  }

  .trans-type {
    color: #8187a5;
  }

  .trans-time {
    display: inline-block;
    width: 140px;
  }

  .trans-status {
    float: right;
  }
}
</style>
