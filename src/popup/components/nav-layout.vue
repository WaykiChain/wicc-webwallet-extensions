<template>
  <div class="layout">
    <nav-bar
        :title.sync="title"
        :back-type="backType"
        :path="path">
      <slot name="title"></slot>
    </nav-bar>
    <div class="layout-body">
      <slot></slot>
    </div>
    <div class="layout-footer" :style="{paddingTop: `${footerPadding}px`}">
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
      },
      backType: {
        type: String,
        default: "arrow"
      },
      footerPadding: {
        type: [Number, String],
        default: 0
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
    padding: 0 24px;
  }
</style>
