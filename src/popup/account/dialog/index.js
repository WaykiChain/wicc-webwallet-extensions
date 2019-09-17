/* eslint-disable standard/no-callback-literal */
import ViewMnemonicDialog from './view-mnemonic-dialog'
import ViewPkDialog from './view-pk-dialog'
import QrCodeDialog from './qr-code-dialog'
import ConfirmPasswordDialog from './confirm-password-dialog'
import RegisterConfirmDialog from './register-confirm-dialog'
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { i18n } from '../../locale'
Vue.use(VueI18n)

const getInstance = (Constructor, options) => {
  const instance = new Constructor({
    el: document.createElement('div'),
    i18n,
    ...options
  })

  instance.$on('hide', () => {
    const el = instance.$el
    Vue.nextTick(() => {
      instance.$destroy()
      if (el) {
        el.parentNode.removeChild(el)
      }
    })
  })

  return instance
}

export const openMnemonicDialog = function (network, address) {
  return new Promise((resolve) => {
    const Constructor = Vue.extend(ViewMnemonicDialog)

    const instance = getInstance(Constructor, {
      propsData: {
        network,
        address
      }
    })

    document.body.appendChild(instance.$el)

    instance.show()

    resolve()
  })
}

export const openPkDialog = function (network, address) {
  return new Promise((resolve) => {
    const Constructor = Vue.extend(ViewPkDialog)

    const instance = getInstance(Constructor, {
      propsData: {
        network,
        address
      }
    })

    document.body.appendChild(instance.$el)

    instance.show()

    resolve()
  })
}

export const openQrCodeDialog = function (address) {
  return new Promise((resolve) => {
    const Constructor = Vue.extend(QrCodeDialog)

    const instance = getInstance(Constructor, {
      propsData: {
        address
      }
    })

    document.body.appendChild(instance.$el)

    instance.show()

    resolve()
  })
}

export const openRegisterConfirmDialog = function (address) {
  return new Promise((resolve) => {
    const Constructor = Vue.extend(RegisterConfirmDialog)

    const instance = getInstance(Constructor, {
      propsData: {
        address
      }
    })

    document.body.appendChild(instance.$el)

    instance.show()

    resolve()
  })
}

export const openConfirmPassword = function () {
  return new Promise((resolve, reject) => {
    const Constructor = Vue.extend(ConfirmPasswordDialog)

    const instance = getInstance(Constructor, {
      propsData: {
        callback: (value) => {
          if (value === 'success') {
            resolve()
          } else if (value === 'failure') {
            console.log('password check failed')
          } else {
            reject(new Error('user cancel'))
          }
        }
      }
    })

    instance.$on('cancel', () => {
      const callback = instance.callback
      if (typeof callback === 'function') {
        callback('cancel')
        instance.hide()
      }
    })

    instance.$on('confirm:success', () => {
      const callback = instance.callback
      if (typeof callback === 'function') {
        callback('success')
        instance.hide()
      }
    })

    instance.$on('confirm:failure', () => {
      const callback = instance.callback
      if (typeof callback === 'function') {
        callback('failure')
      }
    })

    document.body.appendChild(instance.$el)

    instance.show()
  })
}
