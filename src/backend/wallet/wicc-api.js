import * as bitcore from 'bitcore-lib'

const DEFAULT_PASSWORD = '12345678'

export default class {
  constructor (network) {
    this.network = network || 'testnet'
    this.api = new bitcore.WiccApi({
      network
    })
  }

  createMnemonicCode () {
    return this.api.createAllCoinMnemonicCode()
  }

  createWallet (mnemonic) {
    return this.api.createWallet(mnemonic, DEFAULT_PASSWORD)
  }
  
  checkMnemonicCode(mnemonic){
    console.log(mnemonic)
    return this.api.checkMnemonicCode(mnemonic) 
  }

  getPrivateKeyFromMnemonic (mnemonic) {
    return bitcore.PrivateKey.fromWIF(this.api.getPriKeyFromMnemonicCode(mnemonic))
  }

  getPrivateKeyWIFFromMnemonic (mnemonic) {
    return this.api.getPriKeyFromMnemonicCode(mnemonic)
  }

  getPrivateKeyFromString (string) {
    return bitcore.PrivateKey.fromWIF(string)
  }

  getAddressFromMnemonicCode (mnemonic) {
    return this.api.getAddressFromMnemonicCode(mnemonic)
  }

  createRegisterSign (privateKey, height) {
    if (!privateKey) {
      throw new Error('privateKey is required')
    }

    const publicKey = privateKey.toPublicKey()

    const registerInfo = {
      nTxType: bitcore.WiccApi.REGISTER_ACCOUNT_TX,
      nVersion: 1,
      nValidHeight: height,
      fees: 10000,
      pubkey: publicKey.toString(),
      minerPubkey: ''
    }

    return this.api.createSignTransaction(privateKey, bitcore.WiccApi.REGISTER_ACCOUNT_TX, registerInfo)
  }

  createRegisterAppSign (privateKey, height, regAcctId, fees, script, scriptDesc) {
    const txInfo = {
      nTxType: bitcore.WiccApi.REG_APP_TX,
      nVersion: 1,
      nValidHeight: height,
      fees: fees * Math.pow(10, 8) + Math.round(Math.random()*10),
      regAcctId,
      script,
      scriptDesc
    }

    return this.api.createSignTransaction(privateKey, bitcore.WiccApi.REG_APP_TX, txInfo)
  }

  createContractSign (privateKey, height, srcRegId, destRegId, value, fees, contract) {
    const txInfo = {
      nTxType: bitcore.WiccApi.CONTRACT_TX,
      nVersion: 1,
      nValidHeight: height,
      fees: fees * Math.pow(10, 8) + Math.round(Math.random()*10),
      srcRegId,
      destRegId,
      value: value * Math.pow(10, 8),
      vContract: contract
    }

    return this.api.createSignTransaction(privateKey, bitcore.WiccApi.CONTRACT_TX, txInfo)
  }

  createTxSign (privateKey, height, srcRegId, destAddr, value, fees) {
    const txInfo = {
      nTxType: bitcore.WiccApi.COMMON_TX,
      nVersion: 1,
      nValidHeight: height,
      fees: fees * Math.pow(10, 8) + Math.round(Math.random()*10),
      srcRegId,
      destAddr,
      value: value * Math.pow(10, 8),
      network: this.network
    }

    return this.api.createSignTransaction(privateKey, bitcore.WiccApi.COMMON_TX, txInfo)
  }

  createDelegateTxSign (privateKey, height, srcRegId, delegateData, fees) {
    const txInfo = {
      nTxType: bitcore.WiccApi.DELEGATE_TX,
      nVersion: 1,
      nValidHeight: height,
      fees: fees * Math.pow(10, 8) + Math.round(Math.random()*10),
      srcRegId,
      delegateData
    }

    return this.api.createSignTransaction(privateKey, bitcore.WiccApi.DELEGATE_TX, txInfo)
  }
}
