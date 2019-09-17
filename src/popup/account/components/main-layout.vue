<template>
  <drawer-layout
      :drawer-width="281"
      :content-drawable="false"
      :enable="false"
      @mask-click="toggleDrawer"
      ref="drawerLayout">
    <div class="main-drawer" slot="drawer">
      <div class="main-drawer-header">
        {{ $t('account.main.tokenList') }}
        <button class="main-drawer-header-close" @click="toggleDrawer"></button>
      </div>
      <div class="main-drawer-body">
        <slot name="drawer"></slot>
      </div>
    </div>
    <div class="main-content" slot="content">
      <!-- <div class="nav-header">
        <img
            @click="toggleDrawer"
            class="main-drawer-toggle"
            src="../../static/main-menu-toggle.svg" />
      </div> -->

      <slot></slot>

      <div class="main-content-body">
        <slot name="body"></slot>
      </div>

      <div class="button-wrapper">
        <slot name="footer"></slot>
      </div>
    </div>
  </drawer-layout>
</template>

<style scoped lang="scss">
  @import 'main-layout';
</style>

<script type="text/jsx">
  import { DrawerLayout } from 'vue-drawer-layout'
  import TokenList from './token-list'
  import Send from '../send'

  export default {
    components: {
      Send,
      DrawerLayout,
      TokenList
    },

    methods: {
      toggleDrawer() {
        this.$refs.drawerLayout.toggle()
      }
    },

    data () {
      return {
      }
    }
  }
</script>
