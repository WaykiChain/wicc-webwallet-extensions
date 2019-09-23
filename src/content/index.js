const PostMessageStream = require('post-message-stream')
const uuidv4 = require('uuid/v4')
const pageStream = new PostMessageStream({
  name: 'inpage',
  target: 'contentscript'
})
const CALLBACK_MAP = {}

const saveCallback = (callback) => {
  if (typeof callback !== 'function') return null
  const id = uuidv4()
  CALLBACK_MAP[id] = callback
  return id
}

const resolveCallback = (id, error, data) => {
  const callback = CALLBACK_MAP[id]
  if (typeof callback === 'function') {
    callback(error, data)
  }
}

let pendingPromise = {
  resolve: null,
  reject: null
}

pageStream.on('data', function ({
  status,
  error,
  data,
  callbackId
}) {
  if (callbackId) {
    return resolveCallback(callbackId, error, data)
  }
  const {
    resolve,
    reject
  } = pendingPromise
  if (resolve) {
    if (status === 'error') {
      reject(error)
    } else {
      resolve(data)
    }
    pendingPromise.resolve = null
    pendingPromise.reject = null
  }
})

const send = (action, data) => {
  if (pendingPromise.resolve) {
    throw new Error('one task has already running')
  }

  pageStream.write({
    from: 'page',
    action,
    data
  })

  return new Promise((resolve, reject) => {
    pendingPromise.resolve = resolve
    pendingPromise.reject = reject
  })
}

const formatValue = (value) => {
  value = value || 0
  return value * Math.pow(10, -8)
}

window.WiccWallet = {
  getDefaultAccount() {
    const promise = Promise.resolve()
    promise.then = function (callback, error) {
      const callbackId = saveCallback((err, data) => {
        callback(data)
      })
      send('getDefaultAccount', {
        callbackId,
      }).then(data => {
        if (data && data.locked)
          callback(data)
      }, err => {
        error(err)
      })
    }
    return promise
  },
  // getDefaultAccount() {
  //   return send('getDefaultAccount', {}).then((account) => {
  //     if (account.activeAccount === null) {
  //       throw new Error('Please create wallet or unlock wallet first')
  //     }

  //     return account
  //   })
  // },

  genCallContractRaw(destRegId, contract, value, callback) {
    const callbackId = saveCallback(callback)

    return send('openContractWindowRaw', {
      destRegId,
      contract,
      value: formatValue(value),
      callbackId,
      test: 1
    })
  },
  callContract(destRegId, contract, value, callback) {
    const callbackId = saveCallback(callback)

    return send('openContractWindow', {
      destRegId,
      contract,
      value: formatValue(value),
      callbackId
    })
  },

  publishContract(script, scriptDesc, callback) {
    const callbackId = saveCallback(callback)

    return send('publishContract', {
      script,
      scriptDesc,
      callbackId
    })
  },

  genPublishContractRaw(script, scriptDesc, callback) {
    const callbackId = saveCallback(callback)

    return send('publishContractRaw', {
      script,
      scriptDesc,
      callbackId,
      onlyRaw: 1
    })
  },

  requestPay(destAddress, value, desc, callback) {
    const callbackId = saveCallback(callback)

    return send('requestPay', {
      destAddress,
      value: formatValue(value),
      desc,
      callbackId
    })
  },

  ///创建
  showCdpCreateView(bcoinSymbol,bcoinNum,scoinSymbol,scoinNum,callback){
    const callbackId = saveCallback(callback)
    return send('createCdpView', {
      wiccNum:bcoinNum,
      wusdNum:scoinNum,
      bcoinSymbol,
      scoinSymbol,
      callbackId
    })
  },
  ///追加
  showCdpAdditionalView(bcoinSymbol,bcoinNum,scoinSymbol,scoinNum,cdpTxId,callback){
    const callbackId = saveCallback(callback)
    return send('additionalCdpView', {
      wiccNum:bcoinNum,
      wusdNum:scoinNum,
      cdpTxId,
      bcoinSymbol,
      scoinSymbol,
      callbackId
    })
  },
  ///清算
  showCdpLiquidView(assetType,liquidateNum,cdpTxId,callback){
    const callbackId = saveCallback(callback)
    return send('liquidCdpView', {
      assetType,
      wusdNum:liquidateNum,
      cdpTxId,
      callbackId
    })
  },
  ///赎回
  showCdpRedeemView(repayNum,redeemSymbol,redeemNum,cdpTxId,callback){
    const callbackId = saveCallback(callback)
    return send('redeemCdpView', {
      wusdNum:repayNum,
      wiccNum:redeemNum,
      redeemSymbol,
      cdpTxId,
      callbackId
    })
  },
  

  ///限价交易  dealType : Limit_BUY / Limit_SELL
  showLimitDexView(dealType,coinType,assetType,amount,price,callback){
    const callbackId = saveCallback(callback)
    return send('dexView',{
      dealType,
      amount,
      limitPrice:price,
      coinType,assetType,
      callbackId
    })
  },

  ///市价交易    dealType : Market_BUY / Market_SELL
  showMarketDexView(dealType,coinType,assetType,amount,callback){
    const callbackId = saveCallback(callback)
    return send('dexView',{
      dealType,
      amount,
      limitPrice:0,
      coinType,assetType,
      callbackId
    })
  },

  showCancelDexView(dealNum,callback){
    const callbackId = saveCallback(callback)
    return send('dexCancelView',{
      dealNum,
      callbackId
    })
  },

  ///发布资产
  walletPluginAssetIssue(assetSymbol,assetName,assetSupply,assetOwnerId,assetMintable,callback){
    const callbackId = saveCallback(callback)
    return send('AssetPub',{
      assetSymbol,
      assetName,
      assetSupply,
      assetOwnerId,
      assetMintable,
      callbackId
    })
  },

   ///资产更新
   walletPluginAssetUpdate(assetSymbol,updateType,updateContent,callback){
    const callbackId = saveCallback(callback)
    return send('AssetUpadte',{
      assetSymbol,
      updateType,
      updateContent,
      callbackId
    })
  },

  ///请求签名
  signMessage(message,callback){
    const callbackId = saveCallback(callback)
    return send('signMessage',{
      message,callbackId
    })
  },





















  genRequestPayRaw(destAddress, value, desc, callback) {
    const callbackId = saveCallback(callback)

    return send('requestPayRaw', {
      destAddress,
      value: formatValue(value),
      desc,
      callbackId,
      onlyRaw: 1
    })
  },

  requestVote(votes, callback) {
    const callbackId = saveCallback(callback)

    return send('requestVote', {
      votes,
      callbackId
    })
  },

  genVoteDelegateRaw(votes, callback) {
    const callbackId = saveCallback(callback)

    return send('requestVote', {
      votes,
      callbackId,
      onlyRaw: 1
    })
  }
}