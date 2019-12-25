<template>
  <nav-layout title="Collect" class="u-full-height">
    <div class="account-qr-code-dialog">
      <qr-code v-if="address" class="qr-code" level="H" :size="130" :value="address"></qr-code>
      <div class="qr-code-address">{{ address }}</div>
      <div class="btn-wrapper">
        <button class="copy-address-btn btn-lighter">{{ $t('common.copyAddress') }}</button>
      </div>
    </div>
  </nav-layout>
</template>

<style lang="scss" scoped>
.account-qr-code-dialog {
    text-align: center;
    padding-top: 70px;
}
.qr-code-address {
    margin-top: 24px;
    margin-bottom: 30px;
    line-height: 19px;
    color: #8187A5;
    font-size: 14px;
}
</style>

<script type="text/jsx">
import NavLayout from "../components/nav-layout";
import QrCode from "qrcode.vue";
import CopyMixin from "../components/copy-mixin";
export default {
  components: {
    NavLayout,
    QrCode
  },

  mixins: [CopyMixin],

  computed: {},

  methods: {
    getCopyText() {
      return this.address;
    }
  },

  data() {
    return {
      address: this.$route.query.address,
      clipboardSelector: ".copy-address-btn"
    };
  }
};
</script>
