<template>
  <router-view></router-view>
</template>

<script>
  import './scss/skeleton.scss'
  import './scss/base.scss'

  export default {
    data: () => {
      return {}
    },

    methods: {
    }
  }
</script>

<style lang="scss">
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    box-sizing: border-box;
    background-color: rgba(247, 247, 247, 1);
  }
</style>