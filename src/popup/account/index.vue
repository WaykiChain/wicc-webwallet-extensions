<template>
  <div class="wallet-container">
    <div class="main-wrapper">
      <main-header></main-header>
      <router-view class="main-content"></router-view>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .main-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .main-content {
    flex: 1 0 0;
  }
</style>

<script type="text/jsx">
  import MainHeader from './components/main-header'

  export default {
    components: {
      MainHeader
    },

    created () {
    },

    methods: {
      gotoWelcome () {
        this.$router.push({
          name: 'welcome'
        })
      }
    },

    data () {
      return {
      }
    }
  }
</script>
