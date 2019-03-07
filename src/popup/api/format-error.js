import { getLanguage, messages } from '../locale'

const ERRORS_MAP = {
  ADDRESS_NOT_ACTIVATED: 'accountNotActivated',
  ACCOUNT_ALREADY_EXISTS: 'accountAlreadyExists',
  PASSWORD_INVALID: 'passwordInvalid'
}

export default function (error) {
  if (!error) return ''

  const message = error.message

  if (message in ERRORS_MAP) {
    const language = getLanguage()
    return messages[language].errors[ERRORS_MAP[message]] || message
  } else if (message) {
    return message
  }

  return JSON.stringify(error)
}
