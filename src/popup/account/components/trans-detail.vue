<template>
  <vodal
      class="trans-detail-dialog"
      :show="visible"
      animation="zoom"
      @hide="onHide"
      :height="380"
      :width="320">
    <div class="content-wrapper">
      <div class="detail-amount" v-show="showTitle"> {{ formatAmount(detailInfo.coinamount, 8) }} {{ detailInfo.coinsymbol }}</div>
      <dl>
        <dt v-show="showTitle">{{ $t('account.transDetail.fromLabel') }}</dt>
        <dd v-show="showTitle">{{ detailInfo.fromaddr }}</dd>
        <dt v-show="showTitle">{{ $t('account.transDetail.toLabel') }}</dt>
        <dd v-show="showTitle">{{ detailInfo.toaddr }}</dd>
        <dt v-show="detailInfo.coinsymbol">{{ $t('account.transDetail.coinsymbol') }}</dt>
        <dd v-show="detailInfo.coinsymbol">{{ detailInfo.coinsymbol }}</dd>

        <dt v-show="detailInfo.scoinstoliquidate >= 0">{{ $t('account.transDetail.scoinstoliquidate') }}</dt>
        <dd v-show="detailInfo.scoinstoliquidate >= 0">{{formatAmount(detailInfo.scoinstoliquidate,8) }} WUSD</dd>

        <dt v-show="detailInfo.assetamount >= 0">{{ $t('account.transDetail.assetamount') }}</dt>
        <dd v-show="detailInfo.assetamount >= 0">{{formatAmount(detailInfo.assetamount,8) }} {{detailInfo.assetsymbol}}</dd>

        <dt v-show="detailInfo.bcoinstostake >= 0">{{ $t('account.transDetail.bcoinstostake') }}</dt>
        <dd v-show="detailInfo.bcoinstostake >= 0">{{formatAmount(detailInfo.bcoinstostake,8) }} WICC</dd>
        <dt v-show="detailInfo.scoinstomint >= 0">{{ $t('account.transDetail.scoinstomint') }}</dt>
        <dd v-show="detailInfo.scoinstomint >= 0">{{ formatAmount(detailInfo.scoinstomint,8) }} WUSD</dd>


        <dt v-show="detailInfo.bcoinstoredeem >= 0">{{ $t('account.transDetail.bcointoredeem') }}</dt>
        <dd v-show="detailInfo.bcoinstoredeem >= 0">{{formatAmount(detailInfo.bcoinstoredeem,8) }} WICC</dd>
        <dt v-show="detailInfo.scoinstorepay >= 0">{{ $t('account.transDetail.scoinstorepay') }}</dt>
        <dd v-show="detailInfo.scoinstorepay >= 0">{{ formatAmount(detailInfo.scoinstorepay,8) }} WUSD</dd>

        <dt>{{ $t('account.transDetail.feesLabel') }}</dt>
        <dd>{{ formatFees(detailInfo.fees).toFixed(8) }}{{detailInfo.feesymbol}}</dd>

        <dt v-show="detailInfo.txtype">{{ $t('account.transDetail.txTypeLabel') }}</dt>
        <dd v-show="detailInfo.txtype">{{ formatNewTxType(detailInfo.txtype) }}</dd>

         <dt v-show="detailInfo.price">{{ $t('account.transDetail.price') }}</dt>
        <dd v-show="detailInfo.price">{{ detailInfo.price/100000000 }}</dd>
        
        <dt>{{ $t('account.transDetail.hashLabel') }}</dt>
        <dd>{{ detailInfo.txid }}</dd>
        <dt v-show="detailInfo.cdp_txid">{{ $t('account.transDetail.cdpid') }}</dt>
        <dd v-show="detailInfo.cdp_txid">{{ detailInfo.cdp_txid }}</dd>

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
  import transUtil from './trans-util'
  import API from "../../api";
  export default {
    name: 'trans-detail',
    data(){
      return{
        detailInfo:{},
        showTitle:true
      }
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      detail: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    watch:{
      detail(val){
        this.getDetailInfo()
      }
    },
    methods: {
      formatNewTxType: transUtil.formatNewTxType,

      formatTime: transUtil.formatTime,

      formatAmount: transUtil.formatAmount,

      formatFees: transUtil.formatFees,

      onHide () {
        this.$emit('update:visible', false)
      },
      getDetailInfo(){
        let param = {
          "hash": this.detail.hash
        };
        API.callRaw('getDetailInfo',{info:param}).then(
        res => {
          console.log(res);
          this.detailInfo = res
          if (this.detailInfo.txtype.indexOf('CDP')<0 && this.detailInfo.txtype.indexOf('DEX')<0){
            this.showTitle = true
          }else{
            this.showTitle = false
          }
          
        },
        error => {
          this.$loading.close();
          this.$toast(
            this.$t("window.transfer.createFailure") + " " + formatError(error),
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
  }
</script>

<style lang="scss" scoped>
  .content-wrapper {
    height: 100%;
    overflow: auto;
  }

  .detail-amount {
    color: #3C78EA;
    font-size: 20px;
    text-align: center;
  }

  dl {
    dt {
      font-size: 15px;
      color: #5B5F67;
      font-weight: 400;
      display: block
    }

    dd {
      display: block;
      font-size: 13px;
      color: #B4BCCC;
      margin-left: 0;
      margin-bottom: 12px;
      word-break: break-all;
    }
  }
</style>
