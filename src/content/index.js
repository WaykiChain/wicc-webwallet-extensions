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

pageStream.on('data', function ({ status, error, data, callbackId }) {
  if (callbackId) {
    return resolveCallback(callbackId, error, data)
  }
  const { resolve, reject } = pendingPromise
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
    throw new Error('one tsk has already running')
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
  getDefaultAccount () {
    return send('getDefaultAccount', {}).then((account) => {
      if (account.activeAccount === null) {
        throw new Error('Please create wallet or unlock wallet first')
      }

      return account
    })
  },

  callContract (destRegId, contract, value, callback) {
    const callbackId = saveCallback(callback)

    return send('openContractWindow', {
      destRegId,
      contract,
      value: formatValue(value),
      callbackId
    })
  },

  publishContract (script, scriptDesc, callback) {
    const callbackId = saveCallback(callback)

    return send('publishContract', {
      script,
      scriptDesc,
      callbackId
    })
  },

  requestPay (destAddress, value, desc, callback) {
    const callbackId = saveCallback(callback)

    return send('requestPay', {
      destAddress,
      value: formatValue(value),
      desc,
      callbackId
    })
  },

  requestVote (votes, callback) {
    const callbackId = saveCallback(callback)

    return send('requestVote', {
      votes,
      callbackId
    })
  }
}
