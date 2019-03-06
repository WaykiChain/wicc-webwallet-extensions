import axios from 'axios'
import * as uuidv4 from 'uuid/v4'

const BAAS_TESTNET = 'https://baas-test.wiccdev.org/v1/api'
const BAAS_MAINNET = 'https://baas.wiccdev.org/v1/api'

const handleResponse = ({ data }) => {
  if (data.code === 0) {
    return data.data
  } else {
    throw new Error('error from server response: ' + data.msg)
  }
}

const handleError = (error) => {
  throw error
}

export default class {
  constructor (network) {
    this.network = network || 'testnet'
    if (this.network === 'testnet') {
      this.host = BAAS_TESTNET
    } else {
      this.host = BAAS_MAINNET
    }
  }

  getBlockInfo () {
    return axios.post(this.host + '/chain/WICC/getblockinfo')
      .then(handleResponse, handleError)
  }

  getAccountInfo (address) {
    return axios.get(this.host + '/chain/account/' + address)
      .then(handleResponse, handleError)
  }

  getTxDetail (tx) {
    return axios.post(this.host + '/chain/transaction/find/detail/', {
      txid: tx,
      symbol: 'WICC'
    }).then(handleResponse, handleError)
  }

  getTokenInfo (regId, address) {
    return axios.get(this.host + '/contract/get/' + regId + '/' + address)
      .then(handleResponse, handleError)
  }

  submitOfflineTrans (rawtx) {
    return axios.post(this.host + '/chain/submit/offtrans', {
      offlineTransactionInfo: rawtx,
      requestUuid: uuidv4(),
      symbol: 'WICC'
    }).then(handleResponse, handleError)
  }

  getTransHistory (address) {
    if (!address) throw new Error('address is required.')
    return axios.post(this.host + '/chain/find', {
      startNumber: 0,
      address,
      symbol: 'WICC'
    }).then(handleResponse, handleError)
  }
}
