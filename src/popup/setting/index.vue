<template>
  <div class="wallet-container">
    <nav-layout class="u-full-height">
      <template slot="title">
        <span>{{ $t('setting.index.title') }}</span>
      </template>

      <template>
        <div class="section-title">
          <span>{{ $t('setting.index.language') }}</span>
          <select v-model="language" class="changelang" @change="handleLanguageChange">
            <option value="en-US">English</option>
            <option value="zh-CN">中文</option>
          </select>
        </div>
        <div class="section-title" @click="gotoNet">
          <span>{{ $t('setting.index.net') }}</span>
          <img src="../static/nextArror.png" />
        </div>
        <div class="section-title" @click="gotoPassword">
          <span>{{ $t('setting.index.changePassword') }}</span>
          <img src="../static/nextArror.png" />
        </div>
        <div class="section-title" @click="gotoAbout">
          <span>{{ $t('setting.about.title') }}</span>
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
  border-bottom: rgba(180, 188, 204, 0.301) 1px solid;
  line-height: 58px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > img {
    width: 8px;
    height: 15px;
  }
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
.changelang{
  border: none;
  margin: 0;
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

  created() {
    const { tab } = this.$router.currentRoute.query;
    if (tab) {
      this.tab = tab;
    }
    this.language = getLanguage();
  },

  components: {
    NavLayout
  },

  methods: {
    handleLanguageChange() {
      setLanguage(this.language);

      this.$i18n.locale = this.language;
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
    },
  },

  data() {
    return {
      tab: "setting",
      language: null
    };
  }
};
</script>
