<template>
  <nav-layout footer-padding="60" :title="$t('account.addToken.title')" class="u-full-height">
    <wallet-input
        v-model="regId"
        :label="$t('account.addToken.regIdLabel')"
        :placeholder="$t('account.addToken.regIdPlaceholder')"></wallet-input>

    <wallet-input
        v-model="name"
        :label="$t('account.addToken.nameLabel')"
        :placeholder="$t('account.addToken.namePlaceholder')"></wallet-input>

    <wallet-input
        v-model="precision"
        readOnly
        :label="$t('account.addToken.precisionLabel')"
        :placeholder="$t('account.addToken.precisionPlaceholder')"></wallet-input>

    <template slot="footer">
      <button class="display-block btn-primary" @click="addToken">{{ $t('common.confirm') }}</button>
    </template>
  </nav-layout>
</template>

<style>
</style>

<script type="text/jsx">
  import WalletInput from '../../components/input'
  import NavLayout from '../../components/nav-layout'
  import API from '../../api/index'
  import formatError from '../../api/format-error'

  export default {
    name: 'add-token',

    components: {
      NavLayout,
      WalletInput
    },

    computed: {
      isValid () {
        return (this.name && this.regId && this.precision)
      }
    },

    created () {
      API.getState().then((state) => {
        this.activeAccount = state.activeAccount
      })
    },

    methods: {
      addToken () {
        this.$loading(this.$t('account.addToken.confirmLoading'))
        API.getState().then((state) => {
          API.addToken(this.activeAccount.id, state.network, this.name, this.regId, this.precision).then(() => {
            this.$loading.close()
            this.$toast(this.$t('account.addToken.addSuccess'), {
              type: 'center'
            })
            window.history.go(-1)
          }, (error) => {
            this.$toast(this.$t('account.addToken.addFailure') + ' ' + formatError(error), {
              type: 'center',
              duration: 5000,
              wordWrap: true
            })
            this.$loading.close()
            console.log(error)
          })
        })
      }
    },

    data () {
      return {
        activeAccount: null,
        regId: null,
        name: null,
        precision: 8
      }
    }
  }
</script>
