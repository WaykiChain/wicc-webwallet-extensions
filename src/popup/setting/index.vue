<template>
  <div class="wallet-container">
    <nav-layout class="u-full-height">
      <template slot="title">
        <span class="tab-item" :class="{ active: tab === 'setting' }" @click="tab = 'setting'">
          {{ $t('setting.index.title') }}
        </span>
        <span class="tab-item" :class="{ active: tab === 'about' }" @click="tab = 'about'">
          {{ $t('setting.about.title') }}
        </span>
      </template>

      <template v-if="tab === 'setting'">
        <div class="section-title">{{ $t('setting.index.language') }}</div>
        <div class="section-content">
          <select v-model="language" class="display-block" @change="handleLanguageChange">
            <option value="en-US">English</option>
            <option value="zh-CN">中文</option>
          </select>
        </div>

        <div class="section-title">{{ $t('setting.index.changePassword') }}</div>
        <div class="section-content">
          <button class="display-block" @click="gotoPassword">{{ $t('setting.index.changePassword') }}</button>
        </div>

        <!--
        <div class="section-title">{{ $t('setting.index.walletTitle') }}</div>
        <div class="section-content">
          <button class="display-block" @click="gotoCreateWallet">{{ $t('setting.index.createWallet') }}</button>
          <button class="display-block" @click="gotoImportWallet">{{ $t('setting.index.importWallet') }}</button>
        </div>
        -->
      </template>

      <template v-if="tab === 'about'">
        <div class="logo-container">
          <img src="../static/about-logo.svg" />
        </div>

        <div class="name-container">
          <div class="name">{{ $t('setting.about.name') }}</div>
          <div class="version">1.0.0</div>
        </div>

        <div class="separator"></div>

        <div class="link-container">
          <div class="title">{{ $t('setting.about.links') }}</div>
          <ul class="link-list">
            <li>
              <a href="https://www.waykichain.com/" target="_blank">{{ $t('setting.about.homepage') }}</a>
            </li>
            <li>
              <a href="https://www.wiccdev.org/" target="_blank">{{ $t('setting.about.devCenter') }}</a>
            </li>
          </ul>
        </div>
      </template>
    </nav-layout>
  </div>
</template>

<style lang="scss" scoped>
  @import "./header-tab.scss";

  .section-title {
    margin: 16px 0;
  }

  .section-content {
    margin-bottom: 16px;
  }

  .logo-container {
    height: 122px;
    background: #f7f7f7;
    margin: 0 -16px;
    text-align: center;

    > img {
      margin-top: 21px;
    }
  }

  .separator {
    border-bottom: 1px solid rgba(180, 188, 204, 0.3);
  }

  .name-container {
    margin: 20px 0;

    .name {
      font-size: 20px;
      color: #5B5F67;
      font-weight: bold;
    }
    .version {
      color: #B4BCCC;
      font-size: 14px;
    }
  }

  .link-container {
    margin-top: 20px;

    .title {
      font-size: 20px;
      color: #5B5F67;
      font-weight: bold;
      margin-bottom: 6px;
    }

    .link-list {
      list-style: none;
      margin: 0;

      li {
        padding: 0;
      }
    }
  }
</style>

<script type="text/jsx">
  import NavLayout from '../components/nav-layout'
  import { getLanguage, setLanguage } from '../locale'

  export default {
    name: 'setting',

    created () {
      const { tab } = this.$router.currentRoute.query
      if (tab) {
        this.tab = tab
      }
      this.language = getLanguage()
    },

    components: {
      NavLayout
    },

    methods: {
      handleLanguageChange () {
        setLanguage(this.language)

        this.$i18n.locale = this.language
      },

      gotoPassword () {
        this.$router.push({
          name: 'changePassword'
        })
      },

      gotoCreateWallet () {
        this.$router.push({
          name: 'createWallet'
        })
      },

      gotoImportWallet () {
        this.$router.push({
          name: 'importWallet'
        })
      }
    },

    data () {
      return {
        tab: 'setting',
        language: null
      }
    }
  }
</script>
