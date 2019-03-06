<template>
  <nav-layout :title="$t('wallet.create.validate.title')" class="u-full-height">
    <wallet-input
        style="margin-top: 16px;"
        v-model="inputMnemonic"
        :label="$t('wallet.create.validate.mnemonicLabel')"
        type="textarea"
        read-only></wallet-input>

    <div>
      <mnemonic-tags
          :mnemonics="shuffledMnemonics"
          @input="handleInput"></mnemonic-tags>
    </div>
    <template slot="footer">
      <button class="display-block btn-primary"
              :disabled="!isCompleted || !isValid"
              @click="confirmCreate"> {{ $t('common.confirm') }} </button>
    </template>
  </nav-layout>
</template>

<style>
</style>

<script type="text/jsx">
  import NavLayout from '../../components/nav-layout'
  import WalletInput from '../../components/input'
  import MnemonicTags from '../../components/mnemonic-tags'
  import * as shuffle from 'shuffle-array'
  import API from '../../api'
  import formatError from '../../api/format-error'
  import eventBus from '../../account/bus'

  export default {
    name: 'validate-mnemonic',

    components: {
      NavLayout,
      WalletInput,
      MnemonicTags
    },

    props: {
      mnemonics: {
        type: Array,
        default: []
      }
    },

    created () {
      this.shuffledMnemonics = shuffle(this.mnemonics.slice())

      const route = this.$router.currentRoute

      const { password, mnemonic } = route.query
      if (password) {
        this.password = password
      }
      if (mnemonic) {
        this.mnemonic = mnemonic
      }

      if (route && route.path) {
        this.isCreatingWallet = route.path.indexOf('wallet') !== -1
      }

      window.onunload = () => {
        localStorage.setItem('WICC_RESTORE_PATH', JSON.stringify({
          name: route.name,
          query: route.query
        }))
      }
    },

    destroyed () {
      window.onunload = null
    },

    computed: {
      isCompleted () {
        return (this.selection || []).length === 12
      }
    },

    methods: {
      confirmCreate () {
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

      validate () {
        const mnemonics = this.mnemonics
        const selection = this.selection || []

        let isValid = true
        for (let i = 0; i < selection.length; i++) {
          if (mnemonics[i] !== selection[i]) {
            isValid = false
          }
        }

        if (!isValid) {
          this.$toast(this.$t('wallet.create.validate.validateErrorTip'), {
            type: 'center'
          })
        }

        return isValid
      },

      handleInput (selection) {
        this.selection = selection
        this.inputMnemonic = selection.join(' ')

        this.isValid = this.validate()
      }
    },

    data () {
      return {
        isCreatingWallet: true,
        selection: [],
        inputMnemonic: '',
        shuffledMnemonics: [],
        isValid: true,
        mnemonic: '',
        password: null
      }
    }
  }
</script>
