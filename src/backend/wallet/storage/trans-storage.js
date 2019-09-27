import BaasAPI from '../baas-api'
import localStorage from '../util/local-storage'

const prefix = 'trans:'

const getStorageKey = (network, address) => {
  return prefix + network + ':' + address
}

const list = (network, address) => {
  const key = getStorageKey(network, address)
  return localStorage.get(key).then((value) => {
    return value || []
  })
}

const updateTxList = []

const updateTxItem = (network, address, tx, fn) => {
  return list(network, address).then((trans) => {
    trans.forEach((item) => {
      if (item.tx === tx) {
        fn(item)
      }
    })

    return localStorage.set(getStorageKey(network, address), trans)
  }).then(() => {
    const index = updateTxList.findIndex((item) => {
      return item.tx === tx
    })

    updateTxList.splice(index, 1)
  })
}

setInterval(() => {
  if (updateTxList.length === 0) return

  console.log('update trans status...', updateTxList)

  updateTxList.forEach(({ network, tx, address }) => {
    const api = new BaasAPI(network)
    api.getTxDetail(tx).then((result) => {
      if (result.confirmedtime) {
        updateTxItem(network, address, tx, (item) => {
          item.confirmedTime = result.confirmedtime
          item.confirmedHeight = result.confirmHeight
        })
      } else if (!result.hash) {
        updateTxItem(network, address, tx, (item) => {
          item.failed = true
        })
      }
    })
  })
}, 15 * 1000) // 15s 轮询一次

export default {
  append (network, address, txType, txObject, desc) {
    return list(network, address).then((array) => {
      const tx = txObject.txid
      array.unshift({
        txType,
        amount: txObject.amount,
        fees: txObject.fee,
        tx,
        srcAddress: txObject.sendAddress,
        desAddress: txObject.toAddress,
        confirmedTime: null,
        symbol: 'WICC',
        createdTime: Date.now(),
        desc
      })

      updateTxList.push({
        network,
        tx,
        address
      })

      return localStorage.set(getStorageKey(network, address), array)
    })
  },

  list
}
