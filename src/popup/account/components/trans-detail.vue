<template>
  <vodal
      class="trans-detail-dialog"
      :show="visible"
      animation="zoom"
      @hide="onHide"
      :height="380"
      :width="320">
    <div class="content-wrapper">
      <div class="detail-amount"> {{ formatAmount(detail.amount, 8) }} {{ detail.symbol }}</div>
      <dl>
        <dt>{{ $t('account.transDetail.fromLabel') }}</dt>
        <dd>{{ detail.srcAddress }}</dd>
        <dt>{{ $t('account.transDetail.toLabel') }}</dt>
        <dd>{{ detail.desAddress || '' }}</dd>
        <dt>{{ $t('account.transDetail.feesLabel') }}</dt>
        <dd>{{ formatFees(detail.fees) }}</dd>
        <dt>{{ $t('account.transDetail.hashLabel') }}</dt>
        <dd>{{ detail.tx }}</dd>
        <dt>{{ $t('account.transDetail.commentLabel') }}</dt>
        <dd>{{ detail.desc }}</dd>
        <dt v-show="detail.txType">{{ $t('account.transDetail.txTypeLabel') }}</dt>
        <dd v-show="detail.txType">{{ formatType(detail.txType) }}</dd>
        <dt>{{ $t('account.transDetail.confirmedTimeLabel') }}</dt>
        <dd>{{ formatTime(detail.confirmedTime * 1000 || detail.createdTime) }}</dd>
      </dl>
    </div>
  </vodal>
</template>

<script>
  import transUtil from './trans-util'

  export default {
    name: 'trans-detail',

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

    methods: {
      formatType: transUtil.formatType,

      formatTime: transUtil.formatTime,

      formatAmount: transUtil.formatAmount,

      formatFees: transUtil.formatFees,

      onHide () {
        this.$emit('update:visible', false)
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
