import API from '../../api'
const STORAGE_KEY = 'WICC_MNEMONIC'
const STORAGE_TIME = 1000 * 60 * 10 // 默认保存 10 分钟

export default {
  async get () {
    const lastSaved = localStorage.getItem(STORAGE_KEY)

    if (lastSaved) {
      try {
        let status = JSON.parse(lastSaved)

        if (status && (Date.now() - status.createdAt < STORAGE_TIME)) {
          return Promise.resolve(status.data)
        }
      } catch (error) {
        console.log('parse saved mnemonic error:', error)
      }
    }

    return API.createMnemonicCode().then((data) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        createdAt: Date.now(),
        data
      }))
      return data
    })
  },

  clear () {
    localStorage.setItem(STORAGE_KEY, null)
  }
}
