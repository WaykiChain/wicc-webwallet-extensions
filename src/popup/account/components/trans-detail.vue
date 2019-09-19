<template>
  <vodal
    class="trans-detail-dialog"
    :show="visible"
    animation="zoom"
    @hide="onHide"
    :height="380"
    :width="320"
  >
    <div class="content-wrapper">
      <div
        class="detail-amount"
        v-show="showTitle"
      >{{ formatAmount(isDex ? detailInfo.assetamount : detailInfo.coinamount, 8) }} {{isDex ? detailInfo.assetsymbol : detailInfo.coinsymbol }}</div>

      <dl v-if="detailInfo.txtype == 'CDP_STAKE_TX'">
        <dt>{{ $t('account.transDetail.bcoinstostake') }}</dt>
        <dd
          v-for="key in Object.keys(detailInfo.assetstostake)"
          :key="key"
        >{{formatAmount(detailInfo.assetstostake[key],8) }} {{key}}</dd>
        <dt>{{ $t('account.transDetail.scoinstomint') }}</dt>
        <dd>{{formatAmount(detailInfo.scoinstomint,8) }} {{detailInfo.scoinsymbol}}</dd>

        <dt>{{ $t('account.transDetail.feesLabel') }}</dt>
        <dd>{{ formatFees(detailInfo.fees).toFixed(8) }} {{detailInfo.feesymbol}}</dd>

        <dt>{{ $t('account.transDetail.txTypeLabel') }}</dt>
        <dd>{{ formatNewTxType(detailInfo.txtype) }}</dd>

        <dt>{{ $t('account.transDetail.hashLabel') }}</dt>
        <dd>{{ detailInfo.txid }}</dd>

        <dt>{{ $t('account.transDetail.cdpid') }}</dt>
        <dd>{{ detailInfo.cdp_txid }}</dd>

        <dt>{{ $t('account.transDetail.confirmedheight') }}</dt>
        <dd>{{ detailInfo.confirmedheight }}</dd>

        <dt>{{ $t('account.transDetail.confirmedTimeLabel') }}</dt>
        <dd>{{ formatTime(detailInfo.confirmedtime * 1000) }}</dd>

        <dt v-show="detailInfo.memo">{{ $t('account.transDetail.commentLabel') }}</dt>
        <dd>{{ detailInfo.memo }}</dd>
      </dl>

      <dl v-if="detailInfo.txtype == 'CDP_REDEEM_TX'">
        <dt>{{ $t('account.transDetail.bcointoredeem') }}</dt>
        <dd
          v-for="key in Object.keys(detailInfo.assetstoredeem)"
          :key="key"
        >{{formatAmount(detailInfo.assetstoredeem[key],8) }} {{key}}</dd>

        <dt>{{ $t('account.transDetail.scoinstorepay') }}</dt>
        <dd>{{formatAmount(detailInfo.scoinstorepay,8) }} {{'WUSD'}}</dd>

        <dt>{{ $t('account.transDetail.feesLabel') }}</dt>
        <dd>{{ formatFees(detailInfo.fees).toFixed(8) }} {{detailInfo.feesymbol}}</dd>

        <dt>{{ $t('account.transDetail.txTypeLabel') }}</dt>
        <dd>{{ formatNewTxType(detailInfo.txtype) }}</dd>

        <dt>{{ $t('account.transDetail.hashLabel') }}</dt>
        <dd>{{ detailInfo.txid }}</dd>

        <dt>{{ $t('account.transDetail.cdpid') }}</dt>
        <dd>{{ detailInfo.cdptxid }}</dd>

        <dt>{{ $t('account.transDetail.confirmedheight') }}</dt>
        <dd>{{ detailInfo.confirmedheight }}</dd>

        <dt>{{ $t('account.transDetail.confirmedTimeLabel') }}</dt>
        <dd>{{ formatTime(detailInfo.confirmedtime * 1000) }}</dd>

        <dt v-show="detailInfo.memo">{{ $t('account.transDetail.commentLabel') }}</dt>
        <dd>{{ detailInfo.memo }}</dd>
      </dl>

      <dl v-if="detailInfo.txtype == 'CDP_LIQUIDATE_TX'">
        <dt>{{ $t('account.transDetail.scoinstoliquidate') }}</dt>
        <dd
          v-if="detailInfo.scoinstoliquidate"
        >{{ formatFees(detailInfo.scoinstoliquidate).toFixed(8) }} {{detailInfo.scoinsymbol}}</dd>

        <dt>{{ $t('account.transDetail.feesLabel') }}</dt>
        <dd>{{ formatFees(detailInfo.fees).toFixed(8) }} {{detailInfo.feesymbol}}</dd>

        <dt>{{ $t('account.transDetail.txTypeLabel') }}</dt>
        <dd>{{ formatNewTxType(detailInfo.txtype) }}</dd>

        <dt>{{ $t('account.transDetail.hashLabel') }}</dt>
        <dd>{{ detailInfo.txid }}</dd>

        <dt>{{ $t('account.transDetail.cdpid') }}</dt>
        <dd>{{ detailInfo.cdptxid }}</dd>

        <dt>{{ $t('account.transDetail.confirmedheight') }}</dt>
        <dd>{{ detailInfo.confirmedheight }}</dd>

        <dt>{{ $t('account.transDetail.confirmedTimeLabel') }}</dt>
        <dd>{{ formatTime(detailInfo.confirmedtime * 1000) }}</dd>

        <dt v-show="detailInfo.memo">{{ $t('account.transDetail.commentLabel') }}</dt>
        <dd>{{ detailInfo.memo }}</dd>
      </dl>
      <dl v-if="showTitle">
        <dl v-if="!isDex">
          <dt>{{ $t('account.transDetail.fromLabel') }}</dt>
          <dd>{{ detailInfo.fromaddr }}</dd>
          <dt>{{ $t('account.transDetail.toLabel') }}</dt>
          <dd>{{ detailInfo.toaddr }}</dd>
        </dl>

        <dt>{{ $t('account.transDetail.feesLabel') }}</dt>
        <dd>{{ formatFees(detailInfo.fees).toFixed(8) }} {{detailInfo.feesymbol}}</dd>

        <dt>{{ $t('account.transDetail.txTypeLabel') }}</dt>
        <dd>{{ formatNewTxType(detailInfo.txtype) }}</dd>

        <dt>{{ $t('account.transDetail.hashLabel') }}</dt>
        <dd>{{ detailInfo.txid }}</dd>

        <dt>{{ $t('account.transDetail.confirmedheight') }}</dt>
        <dd>{{ detailInfo.confirmedheight }}</dd>

        <dt>{{ $t('account.transDetail.confirmedTimeLabel') }}</dt>
        <dd>{{ formatTime(detailInfo.confirmedtime * 1000) }}</dd>

        <dt v-show="detailInfo.memo">{{ $t('account.transDetail.commentLabel') }}</dt>
        <dd>{{ detailInfo.memo }}</dd>
      </dl>
    </div>
  </vodal>
</template>

<script>
import transUtil from "./trans-util";
import API from "../../api";
export default {
  name: "trans-detail",
  data() {
    return {
      detailInfo: {},
      showTitle: false,
      isDex: false
    };
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    detail: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  watch: {
    detail(val) {
      this.getDetailInfo();
    }
  },
  methods: {
    formatNewTxType: transUtil.formatNewTxType,

    formatTime: transUtil.formatTime,

    formatAmount: transUtil.formatAmount,

    formatFees: transUtil.formatFees,

    onHide() {
      this.$emit("update:visible", false);
    },
    getDetailInfo() {
      let param = {
        hash: this.detail.hash
      };
      API.callRaw("getDetailInfo", { info: param }).then(
        res => {
          console.log("通过hash查到的详情===》", res);
          this.detailInfo = res;
          if (this.detailInfo.txtype.indexOf("CDP") < 0) {
            this.showTitle = true;
          } else {
            this.showTitle = false;
          }
          if (this.detailInfo.txtype.indexOf("DEX") < 0) {
            this.isDex = false;
          } else {
            this.isDex = true;
          }
        },
        error => {
          console.log(error.message)
          this.$loading.close();
          this.$toast(
            this.$t(error.message),
            {
              type: "center",
              duration: 5000,
              wordWrap: true
            }
          );
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.content-wrapper {
  height: 100%;
  overflow: auto;
}

.detail-amount {
  color: #3c78ea;
  font-size: 20px;
  text-align: center;
}

dl {
  dt {
    font-size: 15px;
    color: #5b5f67;
    font-weight: 400;
    display: block;
  }

  dd {
    display: block;
    font-size: 13px;
    color: #b4bccc;
    margin-left: 0;
    margin-bottom: 12px;
    word-break: break-all;
  }
}
</style>
