const callBackend = (action, data) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      from: 'popup',
      action,
      data
    }, function (response) {
      response = response || {}
      if (response.status === 'error') {
        reject(response.error)
      } else {
        resolve(response.data)
      }
    })
  })
}

export default {
  async callPageCallback (callbackId, error, data) {
    return callBackend('callPageCallback', {
      callbackId,
      error,
      data
    })
  },

  async createMnemonicCode () {
    return callBackend('createMnemonicCode', {
      network: 'testnet'
    })
  },

  async getState () {
    return callBackend('getState', {})
  },

  async getMnemonic (network, address) {
    return callBackend('getMnemonic', {
      network,
      address
    })
  },

  async getPrivateKey (network, address) {
    return callBackend('getPrivateKey', {
      network, address
    })
  },

  async setNetwork (network) {
    return callBackend('setNetwork', {
      network
    })
  },

  async unlock (password) {
    return callBackend('unlock', {
      password
    })
  },

  async validatePassword (password) {
    return callBackend('validatePassword', {
      password
    })
  },

  async changePassword (password, newPassword) {
    return callBackend('changePassword', {
      password,
      newPassword
    })
  },

  async logout () {
    return callBackend('logout', {})
  },

  async registerAccount (address) {
    return callBackend('registerAccount', {
      address
    })
  },

  async send (network, address, destAddr, value, fees, desc) {
    return callBackend('send', {
      network,
      address,
      destAddr,
      fees,
      value,
      desc
    })
  },

  async sendToken (network, address, name, regId, destAddress, amount, fees, desc) {
    return callBackend('sendToken', {
      network,
      address,
      name,
      regId,
      destAddress,
      fees,
      amount,
      desc
    })
  },

  async getTokenTransHistory (network, address, regId) {
    return callBackend('getTokenTransHistory', {
      network,
      address,
      regId
    })
  },

  async callContract (network, address, destRegId, value, fees, contract) {
    return callBackend('callContract', {
      network,
      address,
      destRegId,
      fees,
      value,
      contract
    })
  },

  async publishContract (network, address, fees, script, scriptDesc) {
    return callBackend('publishContract', {
      network,
      address,
      fees,
      script,
      scriptDesc
    })
  },

  async vote (network, address, votes, fees) {
    return callBackend('vote', {
      network,
      address,
      fees,
      votes
    })
  },

  async getTransHistory (network, address) {
    return callBackend('getTransHistory', {
      network,
      address
    })
  },

  getAccountInfo (network, address) {
    return callBackend('getAccountInfo', {
      network,
      address
    })
  },

  getTokenInfo (network, address, regId) {
    return callBackend('getTokenInfo', {
      network,
      address,
      regId
    })
  },

  async createWallet (password, mnemonic) {
    return callBackend('createWallet', {
      password,
      mnemonic
    })
  },

  async importWallet (password, mnemonic) {
    return callBackend('importWallet', {
      password,
      mnemonic
    })
  },

  async createAccount (mnemonic) {
    return callBackend('createAccount', {
      mnemonic
    })
  },

  async importAccount (mnemonic, privateKey) {
    return callBackend('importAccount', {
      mnemonic,
      privateKey
    })
  },

  setActiveAccount (id) {
    return callBackend('setActiveAccount', {
      id
    })
  },

  addToken (accountId, network, name, regId, precision) {
    return callBackend('addToken', {
      accountId,
      network,
      name,
      regId,
      precision
    })
  },

  removeToken (accountId, index) {
    return callBackend('removeToken', {
      accountId,
      index
    })
  }
}
