<template>
  <nav-layout
    :title="$t('wallet.create.backup.title')"
    :path="backPath"
    class="u-full-height">
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
      <button class="jump" @click="goAccountHome">跳过备份</button>
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
  import download from '../../api/download'
  import mnemonic from './mnemonic'
  import API from '../../api'
  import eventBus from '../../account/bus'

  export default {
    name: 'backup-mnemonic',

    components: {
      NavLayout,
      WalletInput
    },
    created () {
      const route = this.$router.currentRoute
      const { password } = route.query
      if (password) {
        this.password = password
      }

      if (route && route.path) {
        this.isCreatingWallet = route.path.indexOf('wallet') !== -1
      }

      mnemonic.get().then((data) => {
        this.mnemonic = data
      }, (error) => {
        console.log('get mnemonic error:', error.message)
      })
    },

    computed: {
      backPath () {
        if (this.isCreatingWallet) {
          return {
            name: 'createWallet'
          }
        } else {
          return {
            name: 'welcome'
          }
        }
      }
    },

    methods: {
      goAccountHome(){
      this.$loading(this.$t('wallet.create.validate.confirmLoading'))

        setTimeout(() => {
          let promise

          if (this.isCreatingWallet) {
            promise = API.createWallet(this.password, this.mnemonic)
          } else {
            promise = API.createAccount(this.mnemonic)
          }

          promise.then(() => {
            this.$loading.close()
            this.$toast(this.$t('wallet.create.validate.createSuccess'), {
              type: 'center'
            })

            if (!this.isCreatingWallet) {
              eventBus.$emit('header:state:refresh')
            }

            mnemonic.clear()

            this.$router.push({
              name: 'accountMain'
            })
          }, (error) => {
            console.log('create wallet error:', error)
            this.$loading.close()
            this.$toast(this.$t('wallet.create.validate.createFailure') + ' ' + formatError(error), {
              type: 'center',
              duration: 5000,
              wordWrap: true
            })
          })
        }, 300)
    },
      validateWalletMnemonic () {
        if (this.isCreatingWallet) {
          this.$router.push({
            name: 'validateWalletMnemonic',
            query: {
              mnemonic: this.mnemonic,
              password: this.password
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
        mnemonic: '',
        password: null
      }
    }
  }
</script>
<style lang="scss" scoped>
.jump{
  border: none;
  text-align: center;
  width: 100%;
  color: #8e8e8e;
}
</style>
