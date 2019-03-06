<template>
  <nav-layout :title="$t('wallet.create.backup.title')" class="u-full-height">
    <div class="warning-container">
      <div class="tip-title">{{ $t('common.warning') }}</div>
      <div class="tip-content">{{ $t('wallet.create.backup.tip') }}</div>
    </div>

    <wallet-input
        v-model="mnemonic"
        :label="$t('wallet.create.backup.mnemonicLabel')"
        type="textarea"
        read-only></wallet-input>

    <template slot="footer">
      <button class="display-block btn-primary" @click="validateWalletMnemonic">{{ $t('wallet.create.backup.nextButton') }} </button>
      <button class="display-block btn-text" @click="download"><img src="../../static/download.svg" />  {{ $t('wallet.create.backup.downloadButton') }}</button>
    </template>
  </nav-layout>
</template>

<style scoped>
  @import '../warning.scss';
</style>

<script type="text/jsx">
  import WalletInput from '../../components/input'
  import NavLayout from '../../components/nav-layout'
  import bus from './bus'
  import download from '../../api/download'
  import mnemonic from './mnemonic'

  export default {
    name: 'backup-mnemonic',

    components: {
      NavLayout,
      WalletInput
    },

    created () {
      const route = this.$router.currentRoute

      if (route && route.path) {
        this.isCreatingWallet = route.path.indexOf('wallet') !== -1
      }

      mnemonic.get().then((data) => {
        this.mnemonic = data
      }, (error) => {
        console.log('get mnemonic error:', error.message)
      })
    },

    methods: {
      validateWalletMnemonic () {
        bus.mnemonic = this.mnemonic
        if (this.isCreatingWallet) {
          this.$router.push({
            name: 'validateWalletMnemonic',
            query: {
              mnemonic: this.mnemonic
            }
          })
        } else {
          this.$router.push({
            name: 'validateAccountMnemonic',
            query: {
              mnemonic: this.mnemonic
            }
          })
        }
      },

      download () {
        download('wicc-seed.txt', this.mnemonic)
      }
    },

    data () {
      return {
        isCreatingWallet: true,
        mnemonic: ''
      }
    }
  }
</script>
