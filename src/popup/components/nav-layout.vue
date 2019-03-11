<template>
  <div class="layout">
    <nav-bar
        :title.sync="title"
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
    display: flex;
    flex-direction: column;
    overflow: auto;
  }

  .layout-body {
    flex: 1 0 0;
    padding: 0 16px 16px;
  }

  .layout-footer {
    padding: 0 16px;
    margin-top: 12px;
  }
</style>
