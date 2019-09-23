import wallet from './wallet/index'

const TYPE_PATH_MAP = {
  contract: '/window/contract',
  publicContract: '/window/publish-contract',
  requestPay: '/window/request-pay',
  requestVote: '/window/request-vote',
  login: '/window/login',
  walletCreate: '/',
  requestMyTest: '/window/request-my',
  createCdpView: '/window/cdp-create',
  liquidCdpView: '/window/cdp-liquid',
  redeemCdpView: '/window/cdp-redeem',
  additionalCdpView: '/window/cdp-additional',
  dexView: '/window/dex-dealView',
  dexCancelView: '/window/dex-cancel-dealView',
  AssetPub:'/window/assets-pub',
  AssetUpadte:'/window/assets-update',
  signMessage:'/window/message-sign',
  UContractInvoke:'/window/contract-new'
}

const getQueryString = (args) => {
  let result = []
  Object.keys(args).forEach((key) => {
    const value = args[key]
    let valueString
    if (typeof value === 'object') {
      valueString = encodeURIComponent(JSON.stringify(value))
    } else {
      if (key === 'script') {
        valueString = encodeURIComponent(encodeURI(value));
      } else {
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
    height: 667,
    width: 375
  })
}

export default {
  async getDefaultAccount({
    callbackId,
  }) {
    const state = await wallet.getState()

    if (!state.vaultCreated) {
      openWindow('walletCreate', {
        getDefaultAccount: 1,
        callbackId
      })
      throw new Error('Please create wallet first')
    }

    if (state.isLocked) {
      return openWindow('login', {
        getDefaultAccount: 1,
        callbackId
      })
    }
    return wallet.getDefaultAccount().then(account => ({
      ...account,
      locked: 1
    }))
  },

  async openWindow() {
    const popupURL = chrome.extension.getURL('pages/popup.html#/window/contract')

    return chrome.windows.create({
      url: popupURL,
      type: 'popup',
      height: 600,
      width: 375
    })
  },

  async openContractWindow({
    destRegId,
    contract,
    value,
    callbackId
  }) {
    return openWindow('contract', {
      destRegId,
      contract,
      value,
      callbackId
    })
  },

  async openContractWindowRaw({
    destRegId,
    contract,
    value,
    callbackId,
    test
  }) {
    return openWindow('contract', {
      destRegId,
      contract,
      value,
      callbackId,
      test
    })
  },

  async publishContract({
    script,
    scriptDesc,
    callbackId
  }) {
    return openWindow('publicContract', {
      script,
      scriptDesc,
      callbackId
    })
  },

  async publishContractRaw({
    script,
    scriptDesc,
    callbackId,
    onlyRaw
  }) {
    return openWindow('publicContract', {
      script,
      scriptDesc,
      callbackId,
      onlyRaw
    })
  },

  async requestPay({
    destAddress,
    value,
    desc,
    callbackId
  }) {
    return openWindow('requestPay', {
      destAddress,
      value,
      desc,
      callbackId
    })
  },

  /**
   cdp  pop 界面 
   */
  async createCdpView({ wiccNum, wusdNum, bcoinSymbol,scoinSymbol, callbackId }) {
    return openWindow('createCdpView', {
      wiccNum, wusdNum,
      bcoinSymbol,
      scoinSymbol,
    
      callbackId,
    })
  },
  async additionalCdpView({ wiccNum, wusdNum, cdpTxId,bcoinSymbol,scoinSymbol, callbackId }) {
    return openWindow('additionalCdpView', {
      wiccNum, wusdNum, cdpTxId, bcoinSymbol,scoinSymbol,callbackId
    })
  },
  async liquidCdpView({ wusdNum, cdpTxId, callbackId, }) {
    return openWindow('liquidCdpView', {
      wusdNum, cdpTxId,callbackId
    })
  },
  async redeemCdpView({ wusdNum, wiccNum, cdpTxId ,callbackId }) {
    return openWindow('redeemCdpView', {
      wusdNum, wiccNum, cdpTxId,callbackId
    })
  },
  async dexView({ dealType, amount, limitPrice, coinType,assetType,callbackId }) {
    return openWindow('dexView', {
      dealType, amount, limitPrice,  coinType,assetType,callbackId
    })
  },

  async dexCancelView({ dealNum,callbackId }) {
    return openWindow('dexCancelView', {
      dealNum,callbackId
    })
  },
  

  async AssetPub({ assetSymbol,assetName,assetSupply,assetOwnerId,assetMintable,callbackId }) {
    return openWindow('AssetPub', {
      assetSymbol,assetName,assetSupply,assetOwnerId,assetMintable,callbackId
    })
  },

  async AssetUpadte({ assetSymbol,updateType,updateContent,callbackId }) {
    return openWindow('AssetUpadte', {
      assetSymbol,updateType,updateContent,callbackId
    })
  },

  async signMessage({ message,callbackId }) {
    return openWindow('signMessage', {
      message,callbackId
    })
  },
  

  async walletPluginUContractInvoke({ amount,coinSymbol,regId,contract,memo,callbackId }) {
    return openWindow('UContractInvoke', {
      amount,coinSymbol,regId,contract,memo,callbackId
    })
  },

























  async requestPayRaw({
    destAddress,
    value,
    desc,
    callbackId,
    onlyRaw
  }) {
    return openWindow('requestPay', {
      destAddress,
      value,
      desc,
      callbackId,
      onlyRaw
    })
  },

  async requestVote({
    votes,
    callbackId
  }) {
    return openWindow('requestVote', {
      votes,
      callbackId
    })
  },

  async requestVoteRaw({
    votes,
    callbackId,
    onlyRaw
  }) {
    return openWindow('requestVote', {
      votes,
      callbackId,
      onlyRaw
    })
  },
  handleMessage(action, data) {
    data = data || {}
    return new Promise(async (resolve, reject) => {
      const state = await wallet.getState()
      if (!state.vaultCreated) {
        reject(new Error('Please create wallet first'))
      } else if (typeof this[action] === 'function') {
        this[action](data).then(resolve, reject)
      } else {
        reject(new Error('unknown action ' + action))
      }
    })
  }
}