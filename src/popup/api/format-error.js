import i18nUtil from './i18n'
import locale from '../locale'

export default function (error) {
  if (!error) return ''

  const message = error.message

  if (message === 'ADDRESS_NOT_ACTIVATED') {
    const language = i18nUtil.getLanguage()
    return locale[language].common.accountNotActivated
  } else if (message) {
    return message
  }

  return JSON.stringify(error)
}
