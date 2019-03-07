import zh from './zh'
import en from './en'
import Vue from 'vue'
import VueI18n from 'vue-i18n'

export const messages = {
  'en-US': en,
  'zh-CN': zh
}

const KEY = 'WICC_WALLET_LANGUAGE'

export const getLanguage = () => {
  const setting = localStorage.getItem(KEY)
  if (!setting) {
    const language = navigator.language
    if (language.indexOf('zh') !== -1) {
      return 'zh-CN'
    } else {
      return 'en-US'
    }
  }

  return setting
}

export const setLanguage = (lang) => {
  if (['zh-CN', 'en-US'].indexOf(lang) !== -1) {
    localStorage.setItem(KEY, lang)
  }
}

Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale: getLanguage(),
  messages
})
