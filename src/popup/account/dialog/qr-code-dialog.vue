<template>
  <vodal
    class="account-qr-code-dialog"
    :show="visible"
    animation="zoom"
    @hide="onHide"
    :height="380"
    :width="320">
    <qr-code
        v-if="address"
        class="qr-code"
        level="H"
        :size="160"
        :value="address"></qr-code>
    <div class="qr-code-address">
      {{ address }}
    </div>
    <div class="btn-wrapper">
      <button
          class="copy-address-btn btn-primary">{{ $t('common.copyAddress') }}</button>
    </div>
  </vodal>
</template>

<script>
  import QrCode from 'qrcode.vue'
  // import CopyMixin from '../../components/copy-mixin'
  import DialogMixin from './dialog-mixin'

  export default {
    name: 'account-qr-code',

    mixins: [DialogMixin],

    components: {
      QrCode
    },

    props: {
      address: {
        default: 'address not found'
      }
    },

    methods: {
      getCopyText () {
        return this.address
      }
    },

    data () {
      return {
        clipboardSelector: '.copy-address-btn'
      }
    }
  }
</script>

<style scoped>
  .account-qr-code-dialog {
    text-align: center;
  }

  .qr-code {
    width: 160px;
    height: 160px;
    margin: 60px auto 30px auto;
  }

  .qr-code-address {
    margin-bottom: 20px;
    color: #5B5F67;
    font-size: 14px;
  }

  .btn-primary {
    width: 160px;
  }

  .btn-wrapper {
    text-align: center;
  }
</style>