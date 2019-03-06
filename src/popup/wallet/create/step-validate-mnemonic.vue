<template>
  <nav-layout :title="$t('wallet.create.validate.title')" class="u-full-height">
    <wallet-input
        style="margin-top: 16px;"
        v-model="mnemonic"
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
  import bus from './bus'
  import API from '../../api'
  import formatError from '../../api/format-error'
  import eventBus from '../../account/bus'
  import mnemonic from './mnemonic'

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

      if (route && route.path) {
        this.isCreatingWallet = route.path.indexOf('wallet') !== -1
      }
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
            promise = API.createWallet(bus.password, bus.mnemonic)
          } else {
            promise = API.createAccount(bus.mnemonic)
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
        this.mnemonic = selection.join(' ')

        this.isValid = this.validate()
      }
    },

    data () {
      return {
        isCreatingWallet: true,
        selection: [],
        mnemonic: '',
        shuffledMnemonics: [],
        isValid: true
      }
    }
  }
</script>
