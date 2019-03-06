<template>
  <vodal
    class="view-pk-dialog"
    :show="visible"
    animation="zoom"
    @hide="onHide"
    :height="360"
    :width="320">
    <div class="dialog-title">{{ $t('account.dialog.exportPkTitle') }}</div>
    <div class="tip-title">{{ $t('common.warning') }}</div>
    <div class="tip-content">{{ $t('account.dialog.exportPkTip') }}</div>
    <wallet-input
        v-model="privateKey"
        type="textarea"
        readOnly></wallet-input>
    <div class="btn-wrapper">
      <button
          class="copy-address-btn btn-primary">{{ $t('account.dialog.copyPkButton') }}</button>
    </div>
  </vodal>
</template>

<script>
  import WalletInput from '../../components/input'
  import CopyMixin from '../../components/copy-mixin'
  import API from '../../api/index'

  export default {
    name: 'view-private-key',

    mixins: [CopyMixin],

    components: {
      WalletInput
    },

    props: {
      visible: {
        type: Boolean,
        default: false
      },

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
        API.getPrivateKey(this.network, this.address).then((value) => {
          this.privateKey = value
          this.$loading.close()
        }, () => {
          this.$loading.close()
        })
      }, 300)
    },

    methods: {
      show () {
        this.visible = true
      },

      onHide () {
        this.$emit('update:visible', false)
        this.visible = false
        this.$emit('hide')
      },

      getCopyText () {
        return this.privateKey
      }
    },

    data () {
      return {
        privateKey: null,
        clipboardSelector: '.copy-address-btn'
      }
    }
  }
</script>

<style lang="scss" scoped>
  .view-pk-dialog {
  }

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