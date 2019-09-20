import * as bitcore from 'bitcore-lib'
import WriterHelper from 'bitcore-lib/lib/util/writerhelper'
const DEFAULT_PASSWORD = '12345678'

export default class {
  constructor(network) {
    this.network = network || 'testnet'
    this.api = new bitcore.WiccApi({
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
      nTxType: bitcore.WiccApi.REGISTER_ACCOUNT_TX,
      nVersion: 1,
      nValidHeight: height,
      fees: 10000,
      pubkey: publicKey.toString(),
      minerPubkey: '',
    }

    return this.api.createSignTransaction(privateKey, bitcore.WiccApi.REGISTER_ACCOUNT_TX, registerInfo)
  }

  createRegisterAppSign(privateKey, height, regAcctId, fees, script, scriptDesc) {
    const txInfo = {
      nTxType: bitcore.WiccApi.REG_APP_TX,
      nVersion: 1,
      nValidHeight: height,
      fees: fees * Math.pow(10, 8) + Math.round(Math.random() * 10),
      regAcctId,
      script,
      scriptDesc,
      publicKey:privateKey.toPublicKey().toString(),
    }
    alert(regAcctId)
    return this.api.createSignTransaction(privateKey, bitcore.WiccApi.REG_APP_TX, txInfo)
  }

  createContractSign(privateKey, height, srcRegId, destRegId, value, fees, contract) {
    const txInfo = {
      nTxType: bitcore.WiccApi.CONTRACT_TX,
      nVersion: 1,
      nValidHeight: height,
      fees: fees * Math.pow(10, 8) + Math.round(Math.random() * 10),
      srcRegId,
      destRegId,
      value: parseInt(value * Math.pow(10, 8)),
      vContract: contract,
      publicKey:privateKey.toPublicKey().toString(),
    }

    return this.api.createSignTransaction(privateKey, bitcore.WiccApi.CONTRACT_TX, txInfo)
  }

  createTxSign(privateKey, height, srcRegId, destAddr, value, fees) {
    const txInfo = {
      nTxType: bitcore.WiccApi.COMMON_TX,
      nVersion: 1,
      nValidHeight: height,
      fees: fees * Math.pow(10, 8) + Math.round(Math.random() * 10),
      srcRegId,
      destAddr,
      value: parseInt(value * Math.pow(10, 8)),
      network: this.network,
      publicKey:privateKey.toPublicKey().toString(),
    }

    return this.api.createSignTransaction(privateKey, bitcore.WiccApi.COMMON_TX, txInfo)
  }

  /**
   * 多币种转账签名
   */
  createVariousCoinsTx(privateKey, height, srcRegId, destAddr, value, fees , coinType,feeSymbol,network,memo) {
    var destArr = [{
      "coinType":coinType,
      "destAddr":destAddr,
      "value":parseInt(value * Math.pow(10, 8)),
    }
   ]
    const txInfo = {
      nTxType: bitcore.WiccApi.UCOIN_TRANSFER_TX,
      nVersion: 1,
      nValidHeight: height,
      fees: fees * Math.pow(10, 8) + Math.round(Math.random() * 10),
      srcRegId,
      destArr:destArr,
      memo:memo,
      network: network,
      publicKey:privateKey.toPublicKey().toString(),
      feesCoinType:feeSymbol,
    }
    // alert(`${height},${fees},${srcRegId},${destAddr},${value},${network},${txInfo.value},`)
    var cointransferTx = new bitcore.Transaction.UCoinTransferTx(txInfo);
    return cointransferTx.SerializeTx(privateKey)
  }

  createDelegateTxSign(privateKey, height, srcRegId, delegateData, fees) {
    const txInfo = {
      nTxType: bitcore.WiccApi.DELEGATE_TX,
      nVersion: 1,
      nValidHeight: height,
      fees: fees * Math.pow(10, 8) + Math.round(Math.random() * 10),
      srcRegId,
      delegateData,
      publicKey:privateKey.toPublicKey().toString(),
    }

    return this.api.createSignTransaction(privateKey, bitcore.WiccApi.DELEGATE_TX, txInfo)
  }


  cdpStake(info) {

    var map=new Map([[info.bcoin_symbol ? info.bcoin_symbol : 'WICC',info.bcoinsToStake]])
    var cdpStakeTxinfo = {
      nTxType: bitcore.WiccApi.CDP_STAKE_TX,
      nVersion: 1,
      nValidHeight:info.nValidHeight,
      txUid: info.txUid,
      publicKey:info.privateKey.toPublicKey().toString(),
      fees: info.fees,
      cdpTxId: info.cdpTxId == '' ? null : info.cdpTxId,
      scoinsToMint: info.scoinsToMint,
      assetMap:map,
      fee_symbol:info.feeType ? info.feeType : 'WICC',
      network: info.network,
      scoin_symbol:info.scoin_symbol ? info.scoin_symbol : 'WUSD',
    };
    // alert(`${cdpStakeTxinfo.nValidHeight},${cdpStakeTxinfo.txUid},${cdpStakeTxinfo.fees},${cdpStakeTxinfo.cdpTxId},${cdpStakeTxinfo.bcoinsToStake},${cdpStakeTxinfo.scoinsToMint},${cdpStakeTxinfo.fee_symbol}`)
    var cdpStakeTx = new bitcore.Transaction.CdpStakeTx(cdpStakeTxinfo);
    var hex = cdpStakeTx.SerializeTx(info.privateKey)
    return  hex

  }
  cdpliquidate(info) {
    var cdpliquidateTxinfo = {
      nTxType: bitcore.WiccApi.CDP_LIQUIDATE_TX,
      nVersion: 1,
      nValidHeight: info.nValidHeight,
      txUid: info.txUid,
      publicKey:info.privateKey.toPublicKey().toString(),
      fees: info.fees,
      fee_symbol:info.feeType ? info.feeType : 'WICC',
      assetSymbol:info.assetSymbol ? info.assetSymbol : 'WICC',
      cdpTxId: info.cdpTxId,
      scoinsToLiquidate: info.scoinsToLiquidate,
      network: info.network
    };
    // alert(`${cdpliquidateTxinfo.nValidHeight},${cdpliquidateTxinfo.txUid},${cdpliquidateTxinfo.fees},${cdpliquidateTxinfo.cdpTxId},${cdpliquidateTxinfo.scoinsToLiquidate}`)
    var cdpliquidateTx = new bitcore.Transaction.CdpLiquiDateTx(cdpliquidateTxinfo);
    var hex = cdpliquidateTx.SerializeTx(info.privateKey)
    return hex
  }
  cdpRedeem(info){
    var map=new Map([[info.bcoins_symbol?info.bcoins_symbol:"WICC",info.bcoins_to_redeem]])
    var cdpRedeemTxinfo = {
      nTxType: bitcore.WiccApi.CDP_REDEEMP_TX,
      nVersion: 1,
      nValidHeight: info.nValidHeight,
      txUid:info.txUid ? info.txUid : "",
      publicKey:info.privateKey.toPublicKey().toString(),
      fees: info.fees,
      cdpTxId: info.cdpTxId,
      fee_symbol:info.feeType ? info.feeType : 'WICC',
      scoins_to_repay: info.scoins_to_repay,
      assetMap: map,
      network: info.network
    };
    // alert(`${info.feeType},${cdpRedeemTxinfo.txUid},${cdpRedeemTxinfo.fees},${cdpRedeemTxinfo.cdpTxId},${cdpRedeemTxinfo.scoins_to_repay},${cdpRedeemTxinfo.publicKey}`)
    var cdpRedeemTx = new bitcore.Transaction.CdpRedeemTx(cdpRedeemTxinfo);
    var hex = cdpRedeemTx.SerializeTx(info.privateKey)
    return hex
    
  }


  dexPriceSell(info){

    var newInfo = {
      nTxType: bitcore.WiccApi.DEX_SELL_LIMIT_ORDER_TX,
      nVersion: 1,
      nValidHeight:info.nValidHeight,
      fees: info.fees,
      srcRegId: info.srcRegId,
      publicKey:info.privateKey.toPublicKey().toString(),
      feeSymbol:info.feeType ? info.feeType : 'WICC',
      coinSymbol: info.coinType ? info.coinType : 'WICC',
      assetSymbol:info.assetType ? info.assetType : 'WUSD',
      assetAmount:info.assetAmount,
      askPrice:info.askPrice,
      network: info.network
    };
    // alert(`${newInfo.nValidHeight},${newInfo.fees},${newInfo.srcRegId},${newInfo.feeSymbol},${newInfo.assetAmount},${newInfo.askPrice},${newInfo.publicKey},${newInfo.network},${newInfo.coinType},${newInfo.assetType}`)
    var dexTx = new bitcore.Transaction.DexSellLimitOrderTx(newInfo);
    var hex = dexTx.SerializeTx(info.privateKey)
    return hex
  }

  dexPriceBuy(info){
    var dexBuyLimitTxinfo = {
      nTxType: bitcore.WiccApi.DEX_BUY_LIMIT_ORDER_TX,
      nVersion: 1,
      nValidHeight: info.nValidHeight,
      fees: info.fees,
      srcRegId: info.srcRegId,
      publicKey:info.privateKey.toPublicKey().toString(),
      feeSymbol: info.feeType ? info.feeType : 'WICC',
      coinSymbol: info.coinType ? info.coinType : 'WICC',
      assetSymbol:info.assetType ? info.assetType : 'WUSD',
      assetAmount:info.assetAmount,
      bidPrice:info.bidPrice,
      network: info.network
    };
    var dexBuyLimitOrderTx = new bitcore.Transaction.DexBuyLimitOrderTx(dexBuyLimitTxinfo);
    var hex = dexBuyLimitOrderTx.SerializeTx(info.privateKey)
    return hex
  }

  dexMarketSell(info){
    var dexSellMarketTxinfo = {
      nTxType: bitcore.WiccApi.DEX_SELL_MARKET_ORDER_TX,
      nVersion: 1,
      nValidHeight: info.nValidHeight,
      fees: info.fees,
      srcRegId: info.srcRegId,
      publicKey:info.privateKey.toPublicKey().toString(),
      feeSymbol: info.feeType ? info.feeType : 'WICC',
      coinSymbol: info.coinType ? info.coinType : 'WUSD',
      assetSymbol:info.assetType ? info.assetType : 'WICC',
      assetAmount:info.assetAmount,
      network: info.network
    };
    var dexSellMarketOrderTx = new bitcore.Transaction.DexSellMarketOrderTx(dexSellMarketTxinfo);
    var hex = dexSellMarketOrderTx.SerializeTx(info.privateKey)
    return hex
  }
  dexMarketBuy(info){
    var dexBuyMarketTxinfo = {
      nTxType: bitcore.WiccApi.DEX_BUY_MARKET_ORDER_TX,
      nVersion: 1,
      nValidHeight: info.nValidHeight,
      fees: info.fees,
      srcRegId: info.srcRegId,
      publicKey:info.privateKey.toPublicKey().toString(),
      feeSymbol: info.feeType ? info.feeType : 'WICC',
      coinSymbol: info.coinType ? info.coinType : 'WUSD',
      assetSymbol:info.assetType ? info.assetType : 'WICC',
      coinAmount:info.coinAmount,
      network: info.network
    };
    var dexBuyMarketOrderTx = new bitcore.Transaction.DexBuyMarketOrderTx(dexBuyMarketTxinfo);
    var hex = dexBuyMarketOrderTx.SerializeTx(info.privateKey)
    return hex
  }
  dexCancel(info){
    var dexCancelTxinfo = {
      nTxType: bitcore.WiccApi.DEX_CANCEL_ORDER_TX,
      nVersion: 1,
      nValidHeight: info.nValidHeight,
      fees: info.fees,
      feeSymbol: info.feeType ? info.feeType : 'WICC',
      srcRegId: info.srcRegId,
      publicKey:info.privateKey.toPublicKey().toString(),
      orderId: info.orderId,
      network: info.network
    };
  
    var dexCancelOrderTx = new bitcore.Transaction.DexCancelOrderTx(dexCancelTxinfo);
    var hex = dexCancelOrderTx.SerializeTx(info.privateKey)
    return hex
  }
  assetsPub(info){
    var assetData = {
        tokenSymbol: info.assetSymbol,   //asset Symbol Capital letter A-Z 1-7 digits [A_Z]
       ownerAddress: info.assetOwnerId,  //asset owner
       tokeName:info.assetName,  //asset token name
       totalSupply:parseInt(info.assetSupply),// total Supply 10^8
       minTable:info.assetMintable=="true"?true:false    //Whether to increase the number
      }
    var assetCreateInfo = {
      nTxType: bitcore.WiccApi.ASSET_ISUUE,
      nVersion: 1,
      nValidHeight: info.nValidHeight, // create height
      srcRegId: info.srcRegId, // sender's regId
      assetData: assetData,
      feesCoinSymbol:info.feesName,
      publicKey:info.privateKey.toPublicKey().toString(),
      fees: parseInt(info.fees), // fees pay for miner min 500 wicc
    };
    const rawtx = this.api.createSignTransaction(info.privateKey,bitcore.WiccApi.ASSET_ISUUE,assetCreateInfo)
    return rawtx
  }

  assetsUpdate(info){
    var updateType = 0
    if (info.updateType == '1'){
      updateType = WriterHelper.prototype.UpdateAssetType.OWNER_UID
    }else if(info.updateType == '2'){
      updateType = WriterHelper.prototype.UpdateAssetType.NAME
    }else{
      updateType = WriterHelper.prototype.UpdateAssetType.MINT_AMOUNT
    }
    var assetUpdateData = {
      updateType:updateType, 
      updateValue:info.updateType == '3' ? parseInt(info.updateContent) : info.updateContent, //owner address
     }
    var assetCreateInfo = {
      nTxType: bitcore.WiccApi.ASSET_UPDATE,
      nVersion: 1,
      nValidHeight: info.nValidHeight, // create height
      srcRegId: info.srcRegId, // sender's regId
      assetUpdateData: assetUpdateData,
      feesCoinSymbol:info.feesName,
      assetSymbol: info.assetSymbol, 
      publicKey:info.privateKey.toPublicKey().toString(),
      fees: parseInt(info.fees), // fees pay for miner min 500 wicc
    };
    alert(JSON.stringify(assetCreateInfo))
    const rawtx = this.api.createSignTransaction(info.privateKey,bitcore.WiccApi.ASSET_UPDATE,assetCreateInfo)
    return rawtx
  }
  
}


