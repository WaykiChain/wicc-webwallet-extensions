import i18nUtil from './i18n'
import locale from '../locale'

const ERRORS_MAP = {
  ADDRESS_NOT_ACTIVATED: 'accountNotActivated',
  ACCOUNT_ALREADY_EXISTS: 'accountAlreadyExists',
  PASSWORD_INVALID: 'passwordInvalid'
}

export default function (error) {
  if (!error) return ''

  const message = error.message

  if (message in ERRORS_MAP) {
    const language = i18nUtil.getLanguage()
    return locale[language].errors[ERRORS_MAP[message]] || message
  } else if (message) {
    return message
  }

  return JSON.stringify(error)
}
