import BaasAPI from './baas-api'
import WiccAPI from './wicc-api'
import stateStore from './state-store'
import vaultStorage from './storage/vault-storage'
import transStorage from './storage/trans-storage'
import tokenStorage from './storage/token-storage'
import tokenTransStorage from './storage/token-trans-storage'
import { getAddressNetwork, getSendTokenContract } from './util/'

const TESTNET = 'testnet'
const MAINNET = 'mainnet'

const validateNetwork = (network) => {
  if (network !== TESTNET && network !== MAINNET) {
    throw new Error('network is invalid')
  }
}

const getWiccApi = (network) => {
  return new WiccAPI(network)
}

const getSignInfo = (network, address) => {
 
  const baasApi = new BaasAPI(network)
  let srcRegId = null

  return baasApi.getAccountInfo(address).then((data) => {
    srcRegId = data.regID

    if (!srcRegId || !String(srcRegId).trim()) {
      throw new Error('ADDRESS_NOT_ACTIVATED')
    }

    return baasApi.getblockcount()
  }).then((data) => {
    const height = data
    const privateKey = vaultStorage.getPrivateKey(address)

    return {
      srcRegId,
      height,
      privateKey
    }
  })
}

export default {
  async setNetwork ({ network }) {
    validateNetwork(network)

    const activeAccount = vaultStorage.getActiveAccount()
    if (activeAccount && activeAccount.type === 'privateKey' && activeAccount.network !== network) {
      return vaultStorage.switchActiveAccount().then((account) => {
        stateStore.updateState({
          network
        })

        return {
          network,
          account
        }
      })
    } else {
      stateStore.updateState({
        network
      })

      return Promise.resolve({
        network
      })
    }
  },

  async setActiveAccount ({ id }) {
    return vaultStorage.setActiveAccount(id).then((account) => {
      if (account.type === 'privateKey') {
        stateStore.updateState({
          network: account.network
        })
      }

      return {
        account,
        network: account.network
      }
    })
  },
  //checkMnemonicCode
  async checkMnemonicCode ({ mnemonic }) {
    return getWiccApi(TESTNET).checkMnemonicCode(mnemonic)
  },

  async createMnemonicCode ({ network }) {
    validateNetwork(network)
    return getWiccApi(network).createMnemonicCode()
  },

  async createWallet ({ password, mnemonic }) {
    if (!password) {
      throw new Error('password is required')
    }
    if (!mnemonic) {
      throw new Error('mnemonic is required')
    }

    return vaultStorage.createWallet(password, mnemonic).then((blob) => {
      stateStore.updateState({
        vaultBlob: blob
      })
    })
  },

  async createAccount ({ mnemonic }) {
    if (!mnemonic) {
      throw new Error('mnemonic is required')
    }

    return vaultStorage.importAccountWithMnemonic(mnemonic).then((blob) => {
      stateStore.updateState({
        vaultBlob: blob
      })
    }, (error) => {
      console.log('create account error:', error)
      throw error
    })
  },

  async importAccount ({ mnemonic, privateKey }) {
    if (!mnemonic && !privateKey) {
      throw new Error('mnemonic or privateKey is required')
    }

    if (mnemonic) {
      return vaultStorage.importAccountWithMnemonic(mnemonic).then((blob) => {
        stateStore.updateState({
          vaultBlob: blob
        })
      }, (error) => {
        console.log('import account error:', error)
        throw error
      })
    } else {
      return vaultStorage.importAccountWithPrivateKey(privateKey).then((blob) => {
        stateStore.updateState({
          vaultBlob: blob
        }, (error) => {
          console.log('import account error:', error)
          throw error
        })
      })
    }
  },

  async importWallet ({ password, mnemonic }) {
    if (!password) {
      throw new Error('password is required')
    }
    if (!mnemonic) {
      throw new Error('mnemonic is required')
    }

    return vaultStorage.createWallet(password, mnemonic).then((blob) => {
      stateStore.updateState({
        vaultBlob: blob
      })
    })
  },

  async changePassword ({ password, newPassword }) {
    if (!password || !newPassword) {
      throw new Error('password and newPassword is required.')
    }

    return vaultStorage.changePassword(password, newPassword).then((blob) => {
      stateStore.updateState({
        vaultBlob: blob
      })

      return 'success'
    })
  },

  async unlock ({ password }) {
    if (!password) {
      throw new Error('password is required.')
    }

    const state = stateStore.getState()
    const vaultBlob = state.vaultBlob
    if (!vaultBlob) {
      throw new Error('vault is not created yet.')
    }

    return vaultStorage.unlock(password, vaultBlob).then((value) => {
      tokenStorage.init(stateStore.getState().tokensConfig)

      stateStore.updateState({
        isLocked: false
      })

      return value
    })
  },

  async validatePassword ({ password }) {
    if (!password) {
      return false
    }

    const state = stateStore.getState()
    const vaultBlob = state.vaultBlob
    if (!vaultBlob) {
      throw new Error('vault is not created yet.')
    }

    return vaultStorage.validatePassword(password, vaultBlob)
  },

  async logout () {
    vaultStorage.logout()
  },

  async getMnemonic ({ address }) {
    return vaultStorage.getMnemonic(address)
  },

  async getPrivateKey ({ network, address }) {
    const key = vaultStorage.getPrivateKey(address)
    if (key) {
      return key.toWIF()
    }
    return null
  },

  async getState () {
    const state = stateStore.getState() || {}
    let isLocked = !!state.isLocked
    if (!vaultStorage.isLogin()) {
      isLocked = true
    }
    let network = state.network || MAINNET
    let accounts = []
    let activeAccount = null
    let activeAddress = null
    let tokens = []

    if (!isLocked) {
      activeAccount = vaultStorage.getActiveAccount()
      accounts = vaultStorage.getAccounts()
      if (network === TESTNET) {
        activeAddress = activeAccount.testnetAddress
      } else {
        activeAddress = activeAccount.address
      }

      tokens = tokenStorage.get(activeAccount.id)
    }

    return {
      isLocked,
      network,
      vaultCreated: !!state.vaultBlob,
      accounts,
      activeAccount,
      activeAddress,
      tokens
    }
  },

  getTransHistory ({ network, address }) {
    return transStorage.list(network, address).then((value) => {
      return value || []
    })
  },

  validateRegisterAccount ({ address }) {
    const network = getAddressNetwork(address)

    return transStorage.list(network, address)
      .then((trans) => {
        if (trans) {
          for (let item of trans) {
            if (item.txType === 2) {
              throw new Error('IN_ACTIVATING')
            }
          }
        }
      })
  },

  registerAccount ({ address }) {
    const network = getAddressNetwork(address)
    const wiccApi = getWiccApi(network)
    const baasApi = new BaasAPI(network)

    
    return baasApi.getblockcount()
      .then((data) => {
        const height = data
        const privateKey = vaultStorage.getPrivateKey(address)
        return wiccApi.createRegisterSign(privateKey, height)
      })
      .then((sign) => {
        return baasApi.submitOfflineTrans(sign)
      })
      .then((value) => {
        transStorage.append(network, address, 2, value)

        return value
      })
  },

  callContract ({ network, address, destRegId, value, fees, contract }) {
    const wiccApi = getWiccApi(network)
    const baasApi = new BaasAPI(network)

    return getSignInfo(network, address).then(({ srcRegId, height, privateKey }) => {
      if (isNaN(parseFloat(value))) {
        throw new Error('INVALID_VALUE')
      }
      return wiccApi.createContractSign(privateKey, height, srcRegId, destRegId, value, fees, contract)
    }).then((sign) => {
      return baasApi.submitOfflineTrans(sign)
    }).then((value) => {
      transStorage.append(network, address, 4, value)

      return value
    })
  },

  publishContract ({ network, address, fees, script, scriptDesc }) {
    const wiccApi = getWiccApi(network)
    const baasApi = new BaasAPI(network)

    return getSignInfo(network, address).then(({ srcRegId, height, privateKey }) => {
      return wiccApi.createRegisterAppSign(privateKey, height, srcRegId, fees, script, scriptDesc)
    }).then((sign) => {
      return baasApi.submitOfflineTrans(sign)
    }).then((value) => {
      transStorage.append(network, address, 5, value)

      return value
    })
  },

  send ({ network, address, destAddr, value, fees, desc }) {
    const wiccApi = getWiccApi(network)
    const baasApi = new BaasAPI(network)
    return getSignInfo(network, address).then(({ srcRegId, height, privateKey }) => {
      if (isNaN(parseFloat(value))) {
        throw new Error('INVALID_VALUE')
      }
      return wiccApi.createTxSign(privateKey, height, srcRegId, destAddr, value, fees)
    }).then((sign) => {
      return baasApi.submitOfflineTrans(sign)
    }).then((value) => {
      transStorage.append(network, address, 3, value, desc)
      return value
    })
  },

  async vote ({ network, address, votes, fees }) {
    const wiccApi = getWiccApi(network)
    const baasApi = new BaasAPI(network)

    votes = votes || []
    if (votes.length === 0) {
      throw new Error('votes should not be empty')
    }

    const delegateData = await Promise.all(votes.map((vote) => {
      return baasApi.getAccountInfo(vote.address).then((value) => {
        if (value.publicKey) {
          return {
            publicKey: value.publicKey,
            votes: vote.votes
          }
        } else {
          throw new Error(`${vote.address} not found`)
        }
      })
    }))

    return getSignInfo(network, address).then(({ srcRegId, height, privateKey }) => {
      // createDelegateTxSign (privateKey, height, srcRegId, delegateData, fees)
      return wiccApi.createDelegateTxSign(privateKey, height, srcRegId, delegateData, fees)
    }).then((sign) => {
      return baasApi.submitOfflineTrans(sign)
    }).then((value) => {
      transStorage.append(network, address, 6, value)

      return value
    })
  },

  getAccountInfo ({ network, address }) {
    return new BaasAPI(network).getAccountInfo(address)
  },

  getTokenInfo ({ network, address, regId }) {
    return new BaasAPI(network).getTokenInfo(regId, address)
  },

  async addToken ({ accountId, network, name, regId, precision }) {
    tokenStorage.add(accountId, network, name, regId, precision).then((value) => {
      stateStore.updateState({
        tokensConfig: value
      })
    })
  },

  async removeToken ({ accountId, index }) {
    tokenStorage.remove(accountId, index).then((value) => {
      stateStore.updateState({
        tokensConfig: value
      })
    })
  },

  async sendToken ({ network, address, regId, destAddress, amount, fees, desc, name }) {
    const wiccApi = getWiccApi(network)
    const baasApi = new BaasAPI(network)

    return getSignInfo(network, address).then(({ srcRegId, height, privateKey }) => {
      const contract = getSendTokenContract(destAddress, amount * Math.pow(10, 8))
      return wiccApi.createContractSign(privateKey, height, srcRegId, regId, 0, fees, contract)
    }).then((sign) => {
      return baasApi.submitOfflineTrans(sign)
    }).then((txObject) => {
      // TODO 可能不需要
      transStorage.append(network, address, 4, txObject)

      tokenTransStorage.append(network, address, name, regId, destAddress, amount, desc, txObject)
      return txObject
    })
  },

  async getTokenTransHistory ({ network, address, regId }) {
    return tokenTransStorage.list(network, address, regId).then((value) => {
      return value || []
    })
  },

  handleMessage (action, data) {
    data = data || {}
    return new Promise((resolve, reject) => {
      if (typeof this[action] === 'function') {
        this[action](data).then(resolve, (error) => {
          console.log('action failed:', action, data, error)
          reject(error)
        })
      } else {
        reject(new Error('unknown action ' + action))
      }
    })
  }
}
