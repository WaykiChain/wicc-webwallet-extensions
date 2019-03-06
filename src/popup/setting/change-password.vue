<template>
  <nav-layout :title="$t('setting.password.title')" class="u-full-height">
    <wallet-input
        v-model="password"
        :label="$t('setting.password.currentPassword')"
        :placeholder="$t('setting.password.currentPasswordPlaceholder')"
        type="password"></wallet-input>

    <wallet-input
        v-model="newPassword"
        :label="$t('setting.password.newPassword')"
        :placeholder="$t('setting.password.newPasswordPlaceholder')"
        type="password"></wallet-input>

    <wallet-input
        v-model="newPassword2"
        :label="$t('setting.password.newPassword2')"
        :placeholder="$t('setting.password.newPassword2Placeholder')"
        type="password"></wallet-input>

    <template slot="footer">
      <button
          :disabled="!isValid"
          class="display-block btn-primary"
          @click="changePassword">{{ $t('common.confirm') }}</button>
    </template>
  </nav-layout>
</template>

<style>
</style>

<script type="text/jsx">
  import WalletInput from '../components/input'
  import NavLayout from '../components/nav-layout'
  import API from '../api/index'
  import formatError from '../api/format-error'

  export default {
    name: 'change-password',

    components: {
      NavLayout,
      WalletInput
    },

    computed: {
      isValid () {
        return this.password && this.newPassword && this.newPassword2
      }
    },

    methods: {
      changePassword () {
        if (this.newPassword !== this.newPassword2) {
          this.$toast(this.$t('common.passwordInConsistent'), {
            type: 'center'
          })

          return
        }

        this.$loading(this.$t('setting.password.confirmLoading'))

        API.changePassword(this.password, this.newPassword).then(() => {
          this.$loading.close()
          this.$toast(this.$t('setting.password.changeSuccess'), {
            type: 'center'
          })
          window.history.go(-1)
        }, (error) => {
          this.$toast(this.$t('setting.password.changeFailure') + ' ' + formatError(error), {
            type: 'center',
            duration: 5000,
            wordWrap: true
          })
          this.$loading.close()
          console.log(error)
        })
      }
    },

    data () {
      return {
        password: null,
        newPassword: null,
        newPassword2: null
      }
    }
  }
</script>
