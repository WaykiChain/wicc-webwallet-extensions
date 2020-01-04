<template>
  <div class="wallet-container">
    <nav-layout class="u-full-height">
      <div class="title">{{ $t('setting.about.title') }}</div>
      <template>
        <div class="logo-container">
          <div class="name-container">
            <div class="name">
              <span>WaykiMax</span>
              <span></span>
              <span>Version</span>
            </div>
            <div class="version">v2.2.0</div>
          </div>
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
            <li>
              <router-link to="/wallet/protocol">{{ $t('wallet.create.terms') }}</router-link>
            </li>
          </ul>
        </div>

        <div class="separator"></div>

        <div class="link-container">
          <div class="title">{{ $t('setting.about.links') }}</div>
          <ul class="link-list">
            <li>Business contact：biz@waykichainhk.com</li>
            <li>Media contact：cs@waykichainhk.com</li>
          </ul>
        </div>

        <div class="social-icon-container">
          <a class="wechat-link" href="JavaScript: void(0)">
            <img class="wechat-img" src="https://wiccdev.org/images/index/wechat_kf.png" />
          </a>
          <a href="https://t.me/wiccofficial" class="social-icon" target="_blank"></a>
          <a href="https://twitter.com/wayki_chain" class="social-icon twitter" target="_blank"></a>
        </div>
      </template>
    </nav-layout>
  </div>
</template>

<style lang="scss" scoped>
@import "./header-tab.scss";
.u-full-height {
  background: url("../static/about-logo.png") no-repeat 190px top;
  background-size: 224px 168px;
}
.section-content {
  margin-bottom: 16px;
}

.title {
  font-size: 20px;
  color: #21274a;
  line-height: 28px;
  font-weight: 500;
  margin-bottom: 30px;
}

.separator {
  border-bottom: 1px solid #f0f3f7;
  margin: 30px 0;
}

.name-container {
  padding-top: 10px;
  .name {
    line-height: 24px;
    display: flex;
    align-items: center;
    span:first-of-type {
      font-size: 18px;
      color: #1d213c;
      font-weight: 500;
    }
    span:nth-of-type(2) {
      width: 1px;
      height: 12px;
      background-color: #8187A5;
      margin: 0 12px;
    }
    span:last-of-type {
      font-size: 15px;
      color: #21264A;
    }
  }
  .version {
    color: #8187a5;
    font-size: 13px;
    left: 18px;
    margin-top: 14px;
  }
}

.link-container {
  .title {
    font-size: 15px;
    color: #1d213c;
    font-weight: 500;
    line-height: 20px;
    margin-bottom: 8px;
  }

  .link-list {
    list-style: none;
    margin: 0;
    overflow: hidden;

    li {
      padding: 0;
      margin-top: 6px;
      margin-bottom: 0;
      font-size: 13px;
      line-height: 18px;
      color: #8187a5;
      a {
        color: #062deb;
        text-decoration: underline;
      }
    }
  }
}

.social-icon-container {
  margin-top: 56px;
  display: flex;

  .social-icon {
    width: 26px;
    height: 26px;
    margin-right: 12px;
    background: url("../static/telicom.svg");
    &:hover {
      background-image: url("../static/telicom-light.svg");
      &.twitter {
        background-image: url("../static/twitter-light.svg");
      }
    }
    &.twitter {
      background: url("../static/twitter.svg");
    }
  }

  .wechat-link {
    position: relative;
    width: 26px;
    height: 26px;
    background: url("../static/wechat.svg");
    margin-right: 12px;
    &:hover {
      background-image: url("../static/wechat-light.svg");
    }

    .wechat-img {
      display: none;
      width: 120px;
      height: 120px;
    }

    &:hover .wechat-img {
      display: inline-block;
      position: absolute;
      top: -128px;
      left: 0;
      width: 124px;
      height: 124px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 3px 14px rgba(0, 0, 0, 0.16);
      border-radius: 10px;
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

  methods: {},

  data() {
    return {
      tab: "setting",
      language: null
    };
  }
};
</script>
