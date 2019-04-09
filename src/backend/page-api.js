import wallet from './wallet/index'

const TYPE_PATH_MAP = {
  contract: '/window/contract',
  publicContract: '/window/publish-contract',
  requestPay: '/window/request-pay',
  requestVote: '/window/request-vote'
}

const getQueryString = (args) => {
  let result = []
  Object.keys(args).forEach((key) => {
    const value = args[key]
    let valueString
    if (typeof value === 'object') {
      valueString = encodeURIComponent(JSON.stringify(value))
    } else {
      if(key==='script'){
        valueString = encodeURIComponent(encodeURI(value));
      }else{
        valueString = encodeURIComponent(value);
      }
    }
    result.push(key + '=' + valueString)
  })
  return result.join('&')
}

const openWindow = async (type, args) => {
  const path = TYPE_PATH_MAP[type]
  const queryString = getQueryString(args)
  const popupURL = chrome.extension.getURL(`pages/popup.html#${path}?${queryString}`)
  return chrome.windows.create({
    url: popupURL,
    type: 'popup',
    height: 600,
    width: 375
  })
}

export default {
  async getDefaultAccount () {
    const state = await wallet.getState()
    if (state.isLocked) {
      throw new Error('Please unlock wallet first')
    }

    const {
      activeAccount,
      network,
      activeAddress,
      vaultCreated
    } = state

    if (!vaultCreated) {
      throw new Error('Please create wallet first')
    }

    return {
      account: activeAccount ? {
        address: activeAccount.address,
        id: activeAccount.id,
        testnetAddress: activeAccount.testnetAddress
      } : null,
      network,
      address: activeAddress
    }
  },

  async openWindow () {
    const popupURL = chrome.extension.getURL('pages/popup.html#/window/contract')

    return chrome.windows.create({
      url: popupURL,
      type: 'popup',
      height: 600,
      width: 375
    })
  },

  async openContractWindow ({ destRegId, contract, value, callbackId }) {
    return openWindow('contract', {
      destRegId,
      contract,
      value,
      callbackId
    })
  },

  async openContractWindowRaw ({ destRegId, contract, value, callbackId, test }) {
    return openWindow('contract', {
      destRegId,
      contract,
      value,
      callbackId,
      test
    })
  },

  async publishContract ({ script, scriptDesc, callbackId }) {
    return openWindow('publicContract', {script, scriptDesc, callbackId})
  },

  async publishContractRaw ({ script, scriptDesc, callbackId, onlyRaw }) {
    return openWindow('publicContract', {script, scriptDesc, callbackId, onlyRaw})
  },

  async requestPay ({ destAddress, value, desc, callbackId }) {
    return openWindow('requestPay', {
      destAddress,
      value,
      desc,
      callbackId
    })
  },

  async requestPayRaw ({ destAddress, value, desc, callbackId, onlyRaw }) {
    return openWindow('requestPay', {
      destAddress,
      value,
      desc,
      callbackId,
      onlyRaw
    })
  },

  async requestVote ({ votes, callbackId }) {
    return openWindow('requestVote', {
      votes,
      callbackId
    })
  },

  handleMessage (action, data) {
    data = data || {}
    return new Promise((resolve, reject) => {
      if (typeof this[action] === 'function') {
        this[action](data).then(resolve, reject)
      } else {
        reject(new Error('unknown action ' + action))
      }
    })
  }
}
