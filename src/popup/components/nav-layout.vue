<template>
  <div class="layout">
    <nav-bar
        :title.sync="title"
        back-type="close"
        :path="path">
      <slot name="title"></slot>
    </nav-bar>
    <div class="layout-body">
      <slot></slot>
    </div>
    <div class="layout-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
  import NavBar from './nav-bar'

  export default {
    name: 'nav-layout',

    components: {
      NavBar
    },

    props: {
      title: {
        type: String
      },
      path: {
        type: Object
      }
    }
  }
</script>

<style lang="scss" scoped>
  .layout {
    position: relative;
    box-sizing: border-box;
    flex-direction: column;
    padding-top: 16px;
  }

  .layout-body {
    flex: 1 0 0;
    padding: 30px 24px 0;
  }

  .layout-footer {
    margin-top: 12px;
    padding: 60px 24px 0;
  }
</style>
