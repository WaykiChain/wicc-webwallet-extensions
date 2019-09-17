<template>
  <vodal
      class="view-mnemonic-dialog"
      :show="visible"
      animation="zoom"
      @hide="onHide"
      :height="360"
      :width="320">
    <div class="dialog-title">{{ $t('account.dialog.viewMnemonicTitle') }}</div>
    <div class="tip-title">{{ $t('common.warning') }}</div>
    <div class="tip-content">{{ $t('account.dialog.viewMnemonicTip') }}</div>
    <wallet-input
        v-model="mnemonic"
        type="textarea"
        readOnly></wallet-input>
    <div class="btn-wrapper">
      <button class="copy-address-btn btn-primary" @click="download">
        {{ $t('account.dialog.downloadMnemonicButton') }}
      </button>
    </div>
  </vodal>
</template>

<script>
  import WalletInput from '../../components/input'
  import API from '../../api/index'
  import download from '../../api/download'
  import DialogMixin from './dialog-mixin'

  export default {
    name: 'view-mnemonic',

    mixins: [DialogMixin],

    components: {
      WalletInput
    },

    props: {
      network: {
        type: String,
        required: true
      },

      address: {
        type: String,
        required: true
      }
    },

    mounted () {
      this.$loading(this.$t('common.loading'))

      setTimeout(() => {
        API.getMnemonic(this.network, this.address).then((value) => {
          this.mnemonic = value
          this.$loading.close()
        }, () => {
          this.$loading.close()
        })
      }, 300)
    },

    methods: {
      download () {
        download('wicc-seed.txt', this.mnemonic)
      }
    },

    data () {
      return {
        mnemonic: null
      }
    }
  }
</script>

<style lang="scss" scoped>

  .dialog-title {
    margin: 16px 0;
    text-align: center;
    font-size: 16px;
    color: #5B5F67;
  }

  .tip-title {
    font-size: 14px;
    color: #FF1010;

    &::before {
      content: ' ';
      display: inline-block;
      width: 24px;
      height: 14px;
      vertical-align: middle;
      background: url('../../static/warning-icon.svg') center center no-repeat;
      background-size: 18px 14px;
    }
  }

  .tip-content {
    color: #5B5F67;
    font-size: 13px;
    margin-bottom: 16px;
  }

  .btn-primary {
    width: 160px;
  }

  .btn-wrapper {
    text-align: center;
  }
</style>