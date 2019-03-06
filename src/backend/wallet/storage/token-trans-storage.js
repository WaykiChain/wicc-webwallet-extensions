import BaasAPI from '../baas-api'
import localStorage from '../util/local-storage'

const prefix = 'token-trans:'

const getStorageKey = (network, address, regId) => {
  if (!network || !address || !regId) throw new Error('network & address & regId is required.')
  return prefix + network + ':' + regId + ':' + address
}

const list = (network, address, regId) => {
  const key = getStorageKey(network, address, regId)
  return localStorage.get(key).then((value) => {
    return value || []
  })
}

const updateTxList = []

const updateTxItem = (network, address, regId, tx, fn) => {
  return list(network, address, regId).then((trans) => {
    trans.forEach((item) => {
      if (item.tx === tx) {
        fn(item)
      }
    })

    return localStorage.set(getStorageKey(network, address, regId), trans)
  }).then(() => {
    const index = updateTxList.findIndex((item) => {
      return item.tx === tx
    })

    updateTxList.splice(index, 1)
  })
}

setInterval(() => {
  if (updateTxList.length === 0) return

  console.log('update token trans status...', updateTxList)

  updateTxList.forEach(({ network, tx, address, regId }) => {
    const api = new BaasAPI(network)
    api.getTxDetail(tx).then((result) => {
      if (result.confirmedtime) {
        updateTxItem(network, address, regId, tx, (item) => {
          item.confirmedTime = result.confirmedtime
          item.confirmedHeight = result.confirmHeight
        })
      } else if (!result.hash) {
        updateTxItem(network, address, regId, tx, (item) => {
          item.failed = true
        })
      }
    })
  })
}, 15 * 1000) // 15s 轮询一次

export default {
  append (network, address, name, regId, destAddress, amount, desc, txObject) {
    return list(network, address, regId).then((array) => {
      const tx = txObject.txid
      array.unshift({
        amount: parseInt(parseFloat(amount) * Math.pow(10, 8), 10),
        fees: txObject.fee,
        tx,
        srcAddress: txObject.sendAddress,
        desAddress: destAddress,
        confirmedTime: null,
        symbol: name || 'WICC',
        createdTime: Date.now(),
        desc
      })

      updateTxList.push({
        network,
        tx,
        address,
        regId
      })

      return localStorage.set(getStorageKey(network, address, regId), array)
    })
  },

  list
}
