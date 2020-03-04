<template>
  <div class="wallet-container">
    <div class="main-wrapper">
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
 import API from "../api";

  export default {

    created () {
       API.getState().then(
      state => {
        console.log(state)
      })
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
