import WiccWalletLib from 'wicc-wallet-lib'
import {Decimal} from 'decimal.js';
const DEFAULT_PASSWORD = '12345678'
var Hash = WiccWalletLib.bitcore.crypto.Hash
var ECDSA = WiccWalletLib.bitcore.crypto.ECDSA
var WriterHelper = WiccWalletLib.bitcore.util.WriterHelper

export default class {
  constructor(network) {
    this.network = network || 'testnet'
    this.api = new WiccWalletLib.WiccApi({
      network
    })
  }

  createMnemonicCode() {
    return this.api.createAllCoinMnemonicCode()
  }

  createWallet(mnemonic) {
    return this.api.createWallet(mnemonic, DEFAULT_PASSWORD)
  }

  checkMnemonicCode(mnemonic) {
    console.log(mnemonic)
    return this.api.checkMnemonicCode(mnemonic)
  }

  getPrivateKeyFromMnemonic(mnemonic) {
    return bitcore.PrivateKey.fromWIF(this.api.getPriKeyFromMnemonicCode(mnemonic))
  }

  getPrivateKeyWIFFromMnemonic(mnemonic) {
    return this.api.getPriKeyFromMnemonicCode(mnemonic)
  }

  getPrivateKeyFromString(string) {
    return bitcore.PrivateKey.fromWIF(string)
  }

  getAddressFromMnemonicCode(mnemonic) {
    return this.api.getAddressFromMnemonicCode(mnemonic)
  }

  createRegisterSign(privateKey, height) {
    if (!privateKey) {
      throw new Error('privateKey is required')
    }

    const publicKey = privateKey.toPublicKey().toString()

    const registerInfo = {
      nTxType: 2,
      nVersion: 1,
      nValidHeight: height,
      fees: 10000,
      pubkey: publicKey.toString(),
      minerPubkey: '',
    }

    return this.api.createSignTransaction(privateKey, registerInfo)
  }

  createRegisterAppSign(privateKey, height, regAcctId, fees, script, scriptDesc) {
    
    const v = this.handelNum(fees)
    const txInfo = {
      nTxType: 5,
      nVersion: 1,
      nValidHeight: height,
      fees: v + Math.round(Math.random() * 10),
      regAcctId,
      script,
      scriptDesc,
      publicKey: privateKey.toPublicKey().toString(),
    }
    return this.api.createSignTransaction(privateKey, txInfo)
  }

  createContractSign(privateKey, height, srcRegId, destRegId, value, fees, contract) {
    
    const v = this.handelNum(value)
    const txInfo = {
      nTxType: 4,
      nVersion: 1,
      nValidHeight: height,
      fees:this.handelNum(fees) + Math.round(Math.random() * 10),
      srcRegId,
      destRegId,
      value: v,
      vContract: contract,
      publicKey: privateKey.toPublicKey().toString(),
    }

    return this.api.createSignTransaction(privateKey, txInfo)
  }

  createTxSign(privateKey, height, srcRegId, destAddr, value, fees) {
    const commonTxinfo = {
      nTxType: 3,
      nVersion: 1,
      nValidHeight: height,
      fees: this.handelNum(fees) + Math.round(Math.random() * 10),
      srcRegId,
      destAddr,
      value: this.handelNum(value),
      network: this.network,
      memo: "memo",
      publicKey: privateKey.toPublicKey().toString(),
    }

    return this.api.createSignTransaction(privateKey, commonTxinfo)
  }

  /**
   * 多币种转账签名
   */
  createVariousCoinsTx(privateKey, height, srcRegId, destAddr, value, fees, coinType, feeSymbol, network, memo) {
    const v = this.handelNum(value)
    var destArr = [{
      "coinType": coinType,
      "destAddr": destAddr,
      "value": v,
    }
    ]
    
    const txInfo = {
      nTxType: 11,
      nVersion: 1,
      nValidHeight: height,
      fees: this.handelNum(fees) + Math.round(Math.random() * 10),
      srcRegId,
      destArr: destArr,
      memo: memo,
      network: network,
      publicKey: privateKey.toPublicKey().toString(),
      feesCoinType: feeSymbol,
    }

    return this.api.createSignTransaction(privateKey, txInfo)
  }

  createDelegateTxSign(privateKey, height, srcRegId, delegateData, fees) {
    const txInfo = {
      nTxType: 6,
      nVersion: 1,
      nValidHeight: height,
      fees: this.handelNum(fees) + Math.round(Math.random() * 10),
      srcRegId,
      delegateData,
      publicKey: privateKey.toPublicKey().toString(),
    }

    return this.api.createSignTransaction(privateKey, txInfo)
  }


  cdpStake(info) {

    var map = new Map([[info.bcoin_symbol ? info.bcoin_symbol : 'WICC', info.bcoinsToStake]])
    var cdpStakeTxinfo = {
      nTxType: 21,
      nVersion: 1,
      nValidHeight: info.nValidHeight,
      txUid: info.txUid,
      publicKey: info.privateKey.toPublicKey().toString(),
      fees: info.fees,
      cdpTxId: info.cdpTxId == '' ? null : info.cdpTxId,
      scoinsToMint: info.scoinsToMint,
      assetMap: map,
      fee_symbol: info.feeType ? info.feeType : 'WICC',
      network: info.network,
      scoin_symbol: info.scoin_symbol ? info.scoin_symbol : 'WUSD',
    };
  
    return this.api.createSignTransaction(info.privateKey, cdpStakeTxinfo)

  }
  cdpliquidate(info) {
    var cdpliquidateTxinfo = {
      nTxType: 23,
      nVersion: 1,
      nValidHeight: info.nValidHeight,
      txUid: info.txUid,
      publicKey: info.privateKey.toPublicKey().toString(),
      fees: info.fees,
      fee_symbol: info.feeType ? info.feeType : 'WICC',
      assetSymbol: info.assetSymbol ? info.assetSymbol : 'WICC',
      cdpTxId: info.cdpTxId,
      scoinsToLiquidate: info.scoinsToLiquidate,
      network: info.network
    };

    return this.api.createSignTransaction(info.privateKey, cdpliquidateTxinfo)
  }
  cdpRedeem(info) {
    var map = new Map([[info.bcoins_symbol ? info.bcoins_symbol : "WICC", info.bcoins_to_redeem]])
    var cdpRedeemTxinfo = {
      nTxType: 22,
      nVersion: 1,
      nValidHeight: info.nValidHeight,
      txUid: info.txUid ? info.txUid : "",
      publicKey: info.privateKey.toPublicKey().toString(),
      fees: info.fees,
      cdpTxId: info.cdpTxId,
      fee_symbol: info.feeType ? info.feeType : 'WICC',
      scoins_to_repay: info.scoins_to_repay,
      assetMap: map,
      network: info.network
    };

    return this.api.createSignTransaction(info.privateKey, cdpRedeemTxinfo)

  }


  dexPriceSell(info) {

    var newInfo = {
      nTxType: 85,
      nVersion: 1,
      nValidHeight: info.nValidHeight,
      fees: info.fees,
      srcRegId: info.srcRegId,
      publicKey: info.privateKey.toPublicKey().toString(),
      feeSymbol: info.feeType ? info.feeType : 'WICC',
      coinSymbol: info.coinType ? info.coinType : 'WICC',
      assetSymbol: info.assetType ? info.assetType : 'WUSD',
      assetAmount: info.assetAmount,
      askPrice: info.askPrice,
      network: info.network
    };

    return this.api.createSignTransaction(info.privateKey, newInfo)
  }

  dexPriceBuy(info) {
    var dexBuyLimitTxinfo = {
      nTxType: 84,
      nVersion: 1,
      nValidHeight: info.nValidHeight,
      fees: info.fees,
      srcRegId: info.srcRegId,
      publicKey: info.privateKey.toPublicKey().toString(),
      feeSymbol: info.feeType ? info.feeType : 'WICC',
      coinSymbol: info.coinType ? info.coinType : 'WICC',
      assetSymbol: info.assetType ? info.assetType : 'WUSD',
      assetAmount: info.assetAmount,
      bidPrice: info.bidPrice,
      network: info.network
    };

    return this.api.createSignTransaction(info.privateKey, dexBuyLimitTxinfo)
  }

  dexMarketSell(info) {
    var dexSellMarketTxinfo = {
      nTxType: 87,
      nVersion: 1,
      nValidHeight: info.nValidHeight,
      fees: info.fees,
      srcRegId: info.srcRegId,
      publicKey: info.privateKey.toPublicKey().toString(),
      feeSymbol: info.feeType ? info.feeType : 'WICC',
      coinSymbol: info.coinType ? info.coinType : 'WUSD',
      assetSymbol: info.assetType ? info.assetType : 'WICC',
      assetAmount: info.assetAmount,
      network: info.network
    };

    return this.api.createSignTransaction(info.privateKey, dexSellMarketTxinfo)
  }
  dexMarketBuy(info) {
    var dexBuyMarketTxinfo = {
      nTxType: 86,
      nVersion: 1,
      nValidHeight: info.nValidHeight,
      fees: info.fees,
      srcRegId: info.srcRegId,
      publicKey: info.privateKey.toPublicKey().toString(),
      feeSymbol: info.feeType ? info.feeType : 'WICC',
      coinSymbol: info.coinType ? info.coinType : 'WUSD',
      assetSymbol: info.assetType ? info.assetType : 'WICC',
      coinAmount: info.coinAmount,
      network: info.network
    };

    return this.api.createSignTransaction(info.privateKey, dexBuyMarketTxinfo)
  }
  dexCancel(info) {
    var dexCancelTxinfo = {
      nTxType: 88,
      nVersion: 1,
      nValidHeight: info.nValidHeight,
      fees: info.fees,
      feeSymbol: info.feeType ? info.feeType : 'WICC',
      srcRegId: info.srcRegId,
      publicKey: info.privateKey.toPublicKey().toString(),
      orderId: info.orderId,
      network: info.network
    };

    return this.api.createSignTransaction(info.privateKey, dexCancelTxinfo)
  }
  assetsPub(info) {
    var assetData = {
      assetSymbol: info.assetSymbol,   //asset Symbol Capital letter A-Z 1-7 digits [A_Z]
      ownerAddress: info.assetOwnerId,  //asset owner
      assetName: info.assetName,  //asset token name
      totalSupply: parseInt(info.assetSupply),// total Supply 10^8
      minTable: info.assetMintable == "true" ? true : false    //Whether to increase the number
    }
    var assetCreateInfo = {
      nTxType: 9,
      nVersion: 1,
      nValidHeight: info.nValidHeight, // create height
      srcRegId: info.srcRegId, // sender's regId
      assetData: assetData,
      feesCoinSymbol: info.feesName,
      // publicKey: info.privateKey.toPublicKey().toString(),
      fees: parseInt(info.fees), // fees pay for miner min 500 wicc
    };
    const rawtx = this.api.createSignTransaction(info.privateKey, assetCreateInfo)
    return rawtx
  }

  assetsUpdate(info) {
    var updateType = 0
    if (info.updateType == '1') {
      updateType = WriterHelper.prototype.UpdateAssetType.OWNER_UID
    } else if (info.updateType == '2') {
      updateType = WriterHelper.prototype.UpdateAssetType.NAME
    } else {
      updateType = WriterHelper.prototype.UpdateAssetType.MINT_AMOUNT
    }
    var assetUpdateData = {
      updateType: updateType,
      updateValue: info.updateType == '3' ? parseInt(info.updateContent) : info.updateContent, //owner address
    }
    var assetCreateInfo = {
      nTxType: 10,
      nVersion: 1,
      nValidHeight: info.nValidHeight, // create height
      srcRegId: info.srcRegId, // sender's regId
      assetUpdateData: assetUpdateData,
      feesCoinSymbol: info.feesName,
      assetSymbol: info.assetSymbol,
      fees: parseInt(info.fees), // fees pay for miner min 500 wicc
    };
    // alert(JSON.stringify(assetCreateInfo))
    const rawtx = this.api.createSignTransaction(info.privateKey, assetCreateInfo)
    return rawtx

  }
  messageSign(msg, privateKey) {

    var msgBuff = Buffer.from(msg)
    var msgBuffHash = Hash.sha256(Hash.sha256ripemd160(msgBuff));
    var signMsg = ECDSA.sign(msgBuffHash, privateKey, 'endian')

    //验证消息
    var pubKey = privateKey.toPublicKey();
    // var vertifySuccess = ECDSA.verify(msgBuffHash, signMsg, pubKey, 'endian')
    const res = {
      result: {
        SignMessage: signMsg.toString(),
        PublicKey: pubKey.toString(),
      },
      errorCode: 0

    }
    return JSON.stringify(res)
  }

  uContractInvoke(privateKey, height, srcRegId, regId, amount, coinSymbol, fees, feesName, contract, localNetWork, memo) {
    var invokeAppInfo = {
      nTxType: 15,
      nVersion: 1,
      nValidHeight: height,    // create height
      publicKey: privateKey.toPublicKey().toString(),
      srcRegId: srcRegId,    // sender's regId
      destRegId: regId,  // app regId
      feesCoinType: feesName,
      coinType: coinSymbol,
      fees: parseInt(fees),         // fees pay for miner
      value: parseInt(amount),              // amount of WICC to be sent to the app account
      vContract: contract      // contract method, hex format string
    };
    // alert(JSON.stringify(invokeAppInfo))
    var rawtx = this.api.createSignTransaction(privateKey, invokeAppInfo)
    // alert(rawtx)
    return rawtx

  }
  handelNum(x){
    const a = new Decimal(x)
    const b = new Decimal(100000000)
    const v = a.mul(b)
    return parseInt(v)
  }

}


