import * as passworder from 'browser-passworder'
import WiccAPI from '../wicc-api'
import * as uuidv4 from 'uuid/v4'
import WiccWalletLib from 'wicc-wallet-lib'
import { getAddressNetwork, getPrivateKeyNetwork } from '../util/index'

const privateKeyMap = {}

const state = {
  password: null,
  data: null,
  vaultBlob: null,
  activeAccount: null
}

const ACCOUNT_ALREADY_EXISTS = 'ACCOUNT_ALREADY_EXISTS'

const verifyExists = (type, value) => {
  const data = state.data

  if (type === 'privateKey') {
    const network = getPrivateKeyNetwork(value)
    const wiccApi = new WiccAPI(network)
    const pks = []
    for (let item of data) {
      if (item.type === 'mnemonic') {
        pks.push(wiccApi.getPrivateKeyWIFFromMnemonic(item.data.mnemonic))
      }
    }

    if (pks.indexOf(value) !== -1) {
      throw new Error(ACCOUNT_ALREADY_EXISTS)
    }
  }

  for (let item of data) {
    if (item.type === type) {
      if (type === 'mnemonic' && item.data.mnemonic === value) {
        throw new Error(ACCOUNT_ALREADY_EXISTS)
      } else if (type === 'privateKey' && item.data.privateKey === value) {
        throw new Error(ACCOUNT_ALREADY_EXISTS)
      }
    }
  }
}

const createAccountWithMnemonic = (mnemonic) => {
  const testWiccApi = new WiccAPI('testnet')
  const wiccApi = new WiccAPI('mainnet')

  return {
    id: uuidv4(), //v4是随机生成uuid
    type: 'mnemonic',
    data: {
      mnemonic
    },
    address: wiccApi.getAddressFromMnemonicCode(mnemonic).toString(),
    testnetAddress: testWiccApi.getAddressFromMnemonicCode(mnemonic).toString()
  }
}

const createAccountWithPrivateKey = (wif) => {
  const privateKey = WiccWalletLib.bitcore.PrivateKey.fromWIF(wif)
  const address = privateKey.toAddress().toString()

  const network = getAddressNetwork(address)

  return {
    id: uuidv4(),
    type: 'privateKey',
    network,
    data: {
      privateKey: wif
    },
    address: network === 'mainnet' ? address : null,
    testnetAddress: network === 'mainnet' ? null : address
  }
}

export default {
  isLogin () {
    return !!state.password
  },

  async importAccountWithMnemonic (mnemonic) {
    verifyExists('mnemonic', mnemonic)
    const account = createAccountWithMnemonic(mnemonic)
    const data = state.data || []
    const password = state.password
    data.push(account)

    return passworder.encrypt(password, data).then((blob) => {
      state.password = password
      state.vaultBlob = blob

      return blob
    })
  },

  async importAccountWithPrivateKey (privateKey) {
    verifyExists('privateKey', privateKey)
    const account = createAccountWithPrivateKey(privateKey)
    const data = state.data || []
    const password = state.password
    data.push(account)

    return passworder.encrypt(password, data).then((blob) => {
      state.password = password
      state.vaultBlob = blob

      return blob
    })
  },

  getAccounts () {
    const data = state.data
    if (!data) return null

    return data.map((item, index) => {
      return {
        index,
        address: item.address,
        id: item.id,
        type: item.type,
        network: item.network,
        testnetAddress: item.testnetAddress
      }
    })
  },

  getActiveAccount () {
    const data = state.data
    if (!data) return null

    let activeAccount = state.activeAccount

    if (!activeAccount) {
      activeAccount = data[0]
    }

    const index = data.findIndex((value) => {
      return activeAccount.id === value.id
    })

    if (index === -1) {
      activeAccount = data[0]
    }

    if (!activeAccount) {
      return null
    }

    return {
      index,
      address: activeAccount.address,
      id: activeAccount.id,
      type: activeAccount.type,
      network: activeAccount.network,
      testnetAddress: activeAccount.testnetAddress
    }
  },

  async switchActiveAccount () {
    const data = state.data
    if (!data) return null

    for (let item of data) {
      if (item.type === 'mnemonic') {
        return this.setActiveAccount(item.id)
      }
    }

    return null
  },

  async setActiveAccount (id) {
    const data = state.data
    if (!data) return null
    let success = false
    for (let item of data) {
      if (id === item.id) {
        state.activeAccount = {
          address: item.address,
          id: item.id,
          type: item.type,
          network: item.network,
          testnetAddress: item.testnetAddress
        }
        success = true
      }
    }

    if (!success) {
      throw new Error('account not found')
    }

    return state.activeAccount
  },

  getMnemonic (address) {
    const data = state.data
    if (!data) return null
    for (let item of data) {
      if (address === item.address || address === item.testnetAddress) {
        return item.data.mnemonic
      }
    }

    return null
  },

  getPrivateKey (address) {
    if (privateKeyMap[address]) return privateKeyMap[address]
    const data = state.data
    if (!data) return null

    for (let item of data) {
      if (address === item.address || address === item.testnetAddress) {
        if (item.type === 'privateKey') {
          const pk = WiccWalletLib.bitcore.PrivateKey.fromWIF(item.data.privateKey)
          privateKeyMap[address] = pk
          return pk
        } else if (item.type === 'mnemonic') {
          const network = getAddressNetwork(address)
          const wiccApi = new WiccAPI(network)
          const pk = wiccApi.getPrivateKeyFromMnemonic(item.data.mnemonic) //通过助记词获取私钥
          privateKeyMap[address] = pk
          return pk
        }
      }
    }

    return null
  },

  async createWallet (password, mnemonic) {
    const account = createAccountWithMnemonic(mnemonic) //createAccountWithMnemonic 验证是正式环境还是测试环境
    state.data = [account]

    return passworder.encrypt(password, state.data).then((blob) => {
      state.password = password
      state.vaultBlob = blob
      state.activeAccount = null

      return blob
    })
  },

  async unlock (password, vaultBlob) {
    state.vaultBlob = vaultBlob
    return passworder.decrypt(password, vaultBlob).then((value) => {
      state.password = password
      state.data = value

      return value
    })
  },

  async logout () {
    state.password = null
    state.data = null
    state.vaultBlob = null
    state.activeAccount = null
  },

  async changePassword (password, newPassword) {
    const valid = await this.validatePassword(password, state.vaultBlob)
    if (!valid) {
      throw new Error('PASSWORD_INVALID')
    }

    const data = state.data
    if (state.password && data) {
      return passworder.encrypt(newPassword, data).then((blob) => {
        state.password = null
        state.data = null
        state.vaultBlob = null
        state.activeAccount = null

        return blob
      })
    } else {
      throw new Error('password or data is null')
    }
  },

  async validatePassword (password, vaultBlob) {
    return passworder.decrypt(password, vaultBlob).then(() => {
      return true
    }, () => {
      return false
    })
  }
}
