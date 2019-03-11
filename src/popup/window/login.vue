<template>
  <div>
    <div class="logo-container">
      <img src="../static/main-logo.png" width="107"/>
    </div>

    <div class="login-container">
      <input class="display-block" type="password" v-model="password" :placeholder="$t('splash.passwordPlaceholder')" />
      <button class="display-block btn-primary" @click="unlock"> {{ $t('splash.unlockButton') }} </button>
    </div>
  </div>
</template>

<script>
  import API from '../api'

  export default {
    name: 'window-login',

    created () {
      const route = this.$router.currentRoute
      try {
        this.redirectPage = JSON.parse(route.query.redirectPage)
      } catch (error) {
        console.log(error)
      }

      if (!this.redirectPage) {
        throw new Error('redirectUrl is required!')
      }
    },

    data () {
      return {
        password: null,
        redirectPage: null
      }
    },

    methods: {
      gotoTarget () {
        this.$router.push(this.redirectPage)
      },

      unlock () {
        API.unlock(this.password).then(() => {
          this.gotoTarget()
        }, (error) => {
          this.$toast(this.$t('errors.passwordError'), {
            type: 'center'
          })
          throw error
        })
      }
    }
  }
</script>

<style scoped>
  .logo-container {
    padding-top: 128px;
    text-align: center;
  }

  .login-container {
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: 16px;
  }
</style>