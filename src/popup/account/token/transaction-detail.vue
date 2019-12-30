<template>
  <div class="transaction-detail">
    <nav-layout title="交易详情">
      <div class="datail-wrap">
        <div class="icon"></div>
        <div class="amount">-20000 WICC</div>
        <div class="status">交易成功</div>
        <div class="info-list">
          <ul class="address-info-list">
            <li>
              <span class="label">交易类型</span>
              <span class="value type">转账-付款</span>
            </li>
            <li>
              <span class="label">确认时间</span>
              <span class="value">2019-08-11 09:41:32</span>
            </li>
            <li>
              <span class="label">交易哈希</span>
              <span class="value need-copy">4e5485ba…9edf483ca3</span>
            </li>
            <li>
              <span class="label">付款地址</span>
              <span class="value need-copy">WQrb6z…RmRRKw</span>
            </li>
            <li>
              <span class="label">收款地址</span>
              <span class="value need-copy">WQrb6z…RmRRKw</span>
            </li>
            <li>
              <span class="label">矿工费</span>
              <span class="value">1 WICC</span>
            </li>
          </ul>
        </div>
      </div>
    </nav-layout>
  </div>
</template>

<script>
import NavLayout from "../../components/nav-layout";
export default {
  data() {
    return {};
  },
  components: {
    NavLayout
  },
  methods: {}
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
  }
  .amount {
    line-height: 32px;
    color: #1d213c;
    font-size: 24px;
    margin-top: 12px;
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
    padding: 22px 24px 10px;
    border-top: 1px solid #f0f3f7;
    overflow: auto;
    box-sizing: border-box;
  }
  .address-info-list {
    margin-bottom: 0;
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
    }
  }
}
</style>