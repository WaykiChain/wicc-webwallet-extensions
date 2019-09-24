<template>
  <div class="trans-history">
    <trans-detail :visible.sync="transDetailVisible" :detail="currentTrans"></trans-detail>
    <div class="trans-history-title">{{ $t('account.transHistory.title') }}</div>
    <ul class="trans-list" v-if="transactions && transactions.length > 0">
      <li
        class="trans-item"
        @click="handleClick(trans)"
        v-for="(trans, index) in transactions"
        :key="index"
      >
        <div class="first-row">
          <span class="trans-hash">{{ cutMiddleStr(trans.hash,8) }}</span>
          <span class="trans-amount"  v-show="showMoney(trans)">{{ formatAmount(trans.money) }} {{ trans.coinsymbol }}</span>
        </div>
        <div class="second-row">
          <span class="trans-time">{{ formatTime(trans.confirmedtime * 1000) }}</span>
          <span class="trans-type">{{ formatNewTxType(trans.txtype) }}</span>
          <span class="trans-status">{{ formatStatus(trans) }}</span>
        </div>
      </li>
    </ul>
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
      type: Array
    },
    showEmptyBlock: {
      type: Boolean,
      defaultValue: true
    }
  },

  components: {
    TransDetail
  },

  methods: {
    formatNewTxType: transUtil.formatNewTxType,

    formatTime: transUtil.formatTime,

    formatAmount: transUtil.formatAmount,

    formatStatus: transUtil.formatStatus,

    cutMiddleStr: transUtil.cutMiddleStr,

    handleClick(trans) {
      this.transDetailVisible = true;
      this.currentTrans = trans;
    },
    showMoney(trans) {
      if (trans.txtype.indexOf("CDP") < 0 && trans.txtype.indexOf("DEX") < 0) {
        return true;
      }
      return false;
    }
  },

  data() {
    return {
      transDetailVisible: false,
      currentTrans: {}
    };
  }
};
</script>

<style lang="scss" scoped>
.empty-block {
  text-align: center;
}

.trans-history-title {
  font-size: 13px;
  color: #b4bccc;
  padding-bottom: 10px;
  margin-bottom: 12px;
  border-bottom: 1px solid rgba(180, 188, 204, 0.3);
  padding-left: 16px;
}

.trans-list {
  list-style: none;
  padding: 0 20px;
  margin: 0;
}

.trans-item {
  cursor: pointer;
  padding-bottom: 12px;
  border-bottom: 1px solid #eceef2;

  .first-row {
    display: flex;
    flex-direction: row;
  }

  .second-row {
    line-height: 12px;
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
    color: #5b5f67;
    font-size: 17px;
  }

  .trans-time,
  .trans-type,
  .trans-status {
    color: #b4bccc;
    font-size: 12px;
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
