<template>
  <div class="wallet-container">
    <nav-layout class="u-full-height">
      <template slot="title">
        <span>{{ $t('setting.about.title') }}</span>
      </template>

      <template>
        <div class="logo-container">
          <img src="../static/about-logo.svg" />
        </div>

        <div class="name-container">
          <div class="name">{{ $t('setting.about.name') }}</div>
          <div class="version">2.0.7</div>
        </div>

        <div class="separator"></div>

        <div class="link-container">
          <div class="title">{{ $t('setting.about.links') }}</div>
          <ul class="link-list">
            <li>
              <a
                href="https://www.waykichain.com/"
                target="_blank"
              >{{ $t('setting.about.homepage') }}</a>
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
    color: #5b5f67;
    font-weight: bold;
  }
  .version {
    color: #b4bccc;
    font-size: 14px;
  }
}

.link-container {
  margin-top: 20px;

  .title {
    font-size: 20px;
    color: #5b5f67;
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
import NavLayout from "../components/nav-layout";
import { getLanguage, setLanguage } from "../locale";

export default {
  name: "setting",

  components: {
    NavLayout
  },

  methods: {
  },

  data() {
    return {
      tab: "setting",
      language: null
    };
  }
};
</script>
