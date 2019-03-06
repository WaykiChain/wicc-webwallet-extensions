<template>
  <nav-layout :title="$t('wallet.import.title')" class="u-full-height">
    <div class="warning-container">
      <div class="tip-title">{{ $t('common.warning') }}</div>
      <div class="tip-content">{{ $t('wallet.import.tip') }}</div>
    </div>

    <wallet-input
        v-model="mnemonic"
        :label="$t('wallet.import.mnemonic')"
        :placeholder="$t('wallet.import.mnemonicPlaceholder')"
        type="textarea"></wallet-input>

    <wallet-input
        v-model="password"
        :label="$t('wallet.import.password')"
        :placeholder="$t('wallet.import.passwordPlaceholder')"
        type="password"></wallet-input>

    <wallet-input
        v-model="password2"
        :label="$t('wallet.import.password2')"
        :placeholder="$t('wallet.import.password2Placeholder')"
        type="password"></wallet-input>

    <template slot="footer">
      <button
          class="display-block btn-primary"
          :disabled="!isCompleted"
          @click="importWallet">{{ $t('common.confirm') }}</button>
    </template>
  </nav-layout>
</template>

<script>
  import WalletInput from '../components/input'
  import API from '../api'
  import NavLayout from '../components/nav-layout'
  import formatError from '../api/format-error'

  export default {
    name: 'import-wallet',

    components: {
      WalletInput,
      NavLayout
    },

    computed: {
      isCompleted () {
        return (this.password && this.password2 && this.mnemonic)
      }
    },

    methods: {
      importWallet () {
        this.$loading(this.$t('wallet.import.confirmLoading'))

        setTimeout(() => {
          API.importWallet(this.password, this.mnemonic).then(() => {
            this.$loading.close()
            this.$toast(this.$t('wallet.import.importSuccess'), {
              type: 'center'
            })
            this.$router.push({
              name: 'welcome'
            })
          }, (error) => {
            this.$loading.close()
            this.$toast(this.$t('wallet.import.importFailure') + ' ' + formatError(error), {
              type: 'center',
              duration: 5000,
              wordWrap: true
            })
          })
        }, 300)
      }
    },

    data () {
      return {
        password: null,
        password2: null,
        mnemonic: null
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "./warning.scss";
</style>
