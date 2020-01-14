<template>
  <nav-layout footer-padding="60" class="u-full-height">
    <div class="title">{{$t('setting.password.title')}}</div>
    <wallet-input
        v-model="password"
        :message="error"
        :pattern="/^\S{0,}$/"
        :label="$t('setting.password.currentPassword')"
        :placeholder="$t('setting.password.currentPasswordPlaceholder')"
        type="password"></wallet-input>

    <wallet-input
        v-model="newPassword"
        :message="error1"
        :pattern="/^\S{0,}$/"
        :label="$t('setting.password.newPassword')"
        :placeholder="$t('setting.password.newPasswordPlaceholder')"
        type="password"></wallet-input>

    <wallet-input
        v-model="newPassword2"
        :message="error2"
        :pattern="/^\S{0,}$/"
        :label="$t('setting.password.newPassword2')"
        :placeholder="$t('setting.password.newPassword2Placeholder')"
        type="password"></wallet-input>

    <template slot="footer">
      <button
          :disabled="!isValid"
          class="display-block btn-primary"
          @click="validatePassword">{{ $t('common.confirm') }}</button>
    </template>
  </nav-layout>
</template>

<style lang="scss" scoped>
.title {
  font-size: 20px;
  color: #21274a;
  line-height: 28px;
  font-weight: 500;
  margin-bottom: 30px;
}
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

    watch: {
      password() {
        this.error = ""
      },
      newPassword() {
        this.error1 = ""
      },
      newPassword2() {
        this.error2 = ""
      }
    },
  
    computed: {
      isValid () {
        return this.password && this.newPassword2 && this.newPassword.length>=6 && this.newPassword.length<=20 && this.newPassword2.length>=6 && this.newPassword2.length<=20
      }
    },

    methods: {
      validatePassword() {
        API.validatePassword(this.password).then(res => {
          if (res) {
            this.changePassword()
          } else {
            this.error = "当前密码不正确"
          }
        })
      },
      changePassword () {
        if (this.password === this.newPassword) {
          return this.error1 = "不能为当前密码"
        }
        if (this.newPassword !== this.newPassword2) {
          return this.error2 = this.$t('errors.passwordInConsistent')
        }

        this.$loading(this.$t('setting.password.confirmLoading'))

        API.changePassword(this.password, this.newPassword).then(() => {
          this.$loading.close()

          this.$toast(this.$t('setting.password.changeSuccess'), {
            type: 'center'
          })

          this.$router.push({
            name: 'welcome'
          })
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
        newPassword2: null,
        error: '',
        error1: '',
        error2: '',
      }
    }
  }
</script>
