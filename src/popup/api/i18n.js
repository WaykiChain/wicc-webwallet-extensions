const KEY = 'WICC_WALLET_LANGUAGE'

const getLanguage = () => {
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

export default {
  getLanguage,

  setLanguage (lang) {
    if (['zh-CN', 'en-US'].indexOf(lang) !== -1) {
      localStorage.setItem(KEY, lang)
    }
  }
}
