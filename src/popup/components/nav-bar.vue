<template>
  <div class="navbar">
    <div class="navbar-title">
      <slot></slot>
      {{ title }}
    </div>
    <button class="navbar-btn" @click="goBack">
      <img src="../static/back-icon.svg" />
    </button>
  </div>
</template>

<style scoped>
  .navbar {
    position: relative;
    padding-top: 12px;
    border-bottom: 1px solid #ededed;
  }

  .navbar-title {
    color: #2f2f2f;
    font-size: 16px;
    font-weight: 400;
    padding-bottom: 8px;
    text-align: center;
  }

  .navbar-btn {
    position: absolute;
    line-height: 16px;
    padding: 0 6px;
    height: 16px;
    bottom: 8px;
    border: none;
  }

  .navbar-btn img {
    width: 24px;
  }
</style>

<script type="text/jsx">
  export default {
    props: {
      title: {
        type: String
      }
    },

    data () {
      return {
      }
    },

    methods: {
      goBack () {
        history.go(-1)
      }
    }
  }
</script>
