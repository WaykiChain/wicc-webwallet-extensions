<template>
  <div class="wallet-container">
    <nav-layout class="u-full-height">
      <div class="title">
        <span>{{ $t('setting.index.title') }}</span>
      </div>

      <template>
        <div class="section-title">
          <span>{{$t('setting.index.Currency')}}</span>
          <div class="select-container set-currency" v-click-outside="setShowCurr">
            <span @click="setCurrency" class="select-val" :class="{down: showCurrency}">{{currency}}</span>
            <wallet-select
              :options="currencyArr"
              :value="currency"
              :show="showCurrency"
              @on-change="handleCurrencyChange"
            ></wallet-select>
          </div>
        </div>
        <div class="section-title">
          <span>{{ $t('setting.index.language') }}</span>
          <div class="select-container set-currency" v-click-outside="setShowLang">
            <span @click="setLanguge" class="select-val" :class="{down: showLanguage}">{{language}}</span>
            <wallet-select
              :options="languageArr"
              :value="language"
              :show="showLanguage"
              @on-change="handleLanguageChange"
            ></wallet-select>
          </div>
        </div>
        <div class="section-title" @click="gotoNet">
          <span>{{ $t('setting.index.net') }}</span>
          <img src="../static/nextArror.png" />
        </div>
        <div class="section-title" @click="gotoPassword">
          <span>{{ $t('setting.index.changePassword') }}</span>
          <img src="../static/nextArror.png" />
        </div>
      </template>
    </nav-layout>
  </div>
</template>

<style lang="scss" scoped>
@import "./header-tab.scss";

.section-title {
  cursor: pointer;
  border-bottom: 1px solid #f0f3f7;
  line-height: 21px;
  padding: 24px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  color: #1d213c;
  > img {
    width: 8px;
    height: 15px;
  }
}

.select-container {
  position: relative;
}

.select-val {
  display: block;
  color: #8187a5;
  font-size: 15px;
  padding-right: 20px;
  position: relative;
  &.down:after {
    transform: rotate(90deg);
  }
  &:after {
    content: "";
    position: absolute;
    right: -6px;
    width: 20px;
    height: 21px;
    background-color: #ccc;
    background: url("../static/nextArror.png") no-repeat center center;
    background-size: 8px 15px;
    transform-origin: center center;
    transition: all 0.2s;
  }
}

.title {
  font-size: 20px;
  color: #21274a;
  line-height: 28px;
  font-weight: 500;
  margin-bottom: 30px;
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
.changelang {
  border: none;
  margin: 0;
  width: 74px;
  height: 21px;
  color: #8187a5;
  padding: 0;
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
import WalletSelect from "../components/select";
import ClickOutside from "vue-click-outside";

export default {
  name: "setting",

  created() {
    const { tab } = this.$router.currentRoute.query;
    if (tab) {
      this.tab = tab;
    }
    let lang = getLanguage();
    this.language = lang === "zh-CN" ? "中文" : "English";
  },

  directives: { ClickOutside },

  components: {
    NavLayout,
    WalletSelect
  },

  methods: {
    handleLanguageChange(option) {
      this.language = option.value;
      let lang = this.language === "中文" ? "zh-CN" : "en-US";
      setLanguage(lang);
      this.$i18n.locale = lang;
      this.showLanguage = false;
    },

    handleCurrencyChange(option) {
      this.currency = option.value;
      localStorage.setItem("currency", this.currency);
      this.showCurrency = false;
    },

    setShowCurr() {
      this.showCurrency = false;
    },

    setShowLang() {
      this.showLanguage = false;
    },

    setCurrency() {
      this.showCurrency = !this.showCurrency;
    },

    setLanguge() {
      this.showLanguage = !this.showLanguage;
    },

    gotoPassword() {
      this.$router.push({
        name: "changePassword"
      });
    },

    gotoAbout() {
      this.$router.push({
        name: "about"
      });
    },
    gotoNet() {
      this.$router.push({
        name: "changeNet"
      });
    }
  },

  data() {
    return {
      tab: "setting",
      language: null,
      currencyArr: [{ value: "CNY" }, { value: "USD" }],
      currency: localStorage.getItem("currency")
        ? localStorage.getItem("currency")
        : "CNY",
      showCurrency: false,
      showLanguage: false,
      languageArr: [{ value: "中文" }, { value: "English" }]
    };
  }
};
</script>
