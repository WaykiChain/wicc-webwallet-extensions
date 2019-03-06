<template>
  <nav-layout :title="$t('wallet.create.password.title')" class="u-full-height">
    <div class="tip">
      {{ $t('wallet.create.password.tip') }}
    </div>

    <wallet-input
        v-model="password"
        :label="$t('wallet.create.password.password')"
        :placeholder="$t('wallet.create.password.passwordPlaceholder')"
        type="password">
    </wallet-input>

    <wallet-input
        v-model="password2"
        :label="$t('wallet.create.password.password2')"
        :placeholder="$t('wallet.create.password.password2Placeholder')"
        type="password">
    </wallet-input>

    <template slot="footer">
      <button
          :disabled="!isValid"
          class="display-block btn-primary"
          @click="validatePassword"> {{ $t('wallet.create.password.confirmButton') }} </button>
      <button class="display-block" @click="gotoImportWallet"> {{ $t('wallet.create.password.importButton') }} </button>
    </template>
  </nav-layout>
</template>

<style scoped>
  .tip {
    font-size: 15px;
    color: #5B5F67;
    margin: 16px 0;
    font-weight: bold;
  }
</style>

<script type="text/jsx">
  import WalletInput from '../../components/input'
  import NavLayout from '../../components/nav-layout'

  export default {
    components: {
      WalletInput,
      NavLayout
    },

    computed: {
      isValid () {
        return this.password && this.password2
      }
    },

    methods: {
      validatePassword () {
        if (this.password !== this.password2) {
          this.$toast(this.$t('common.passwordInConsistent'), {
            type: 'center'
          })

          return
        }

        this.$router.push({
          name: 'backupWalletMnemonic',

          query: {
            password: this.password
          }
        })
      },

      gotoImportWallet () {
        this.$router.push({
          name: 'importWallet'
        })
      }
    },

    data () {
      return {
        password: '',
        password2: '',
      }
    }
  }
</script>
