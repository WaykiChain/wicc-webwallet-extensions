'use strict';

import _ from 'lodash';
import inherits from 'inherits';
import BufferWriter from '../encoding/bufferwriter';
import Util from './util.js'
import bufferUtil from './buffer';
import assert from 'assert';
import Address from '../address'

/**
 * @desc
 * Wrapper around BufferWriter for enhanced extention
 *
 * @param {Object|string|WriterHelper} obj
 * @constructor
 */
function WriterHelper(obj) {
  if (!(this instanceof WriterHelper)) {
    return new WriterHelper(obj);
  }
  if (obj instanceof WriterHelper) {
    return obj;
  }
  BufferWriter.call(this)

}

inherits(WriterHelper, BufferWriter);

WriterHelper.prototype.writeVarInt = function (sz, value) {
  var buf = Util.writeVarInt(sz, value)
  this.write(buf)
};

// write the string len and string
WriterHelper.prototype.writeString = function (value) {
  assert(value == undefined || _.isString(value) || bufferUtil.isBuffer(value))
  var len = 0
  var buf = value
  if (!_.isEmpty(value)) {
    if (!bufferUtil.isBuffer(buf)) {
      buf = Buffer.from(buf)
    }
    len = buf.length
  }
  this.writeVarintNum(len)
  if (len > 0) {
    this.write(buf)
  }
};

//write the cdp asset
WriterHelper.prototype.writeCdpAsset = function (map) {
  if (map != null || map.size != 0) {
    this.writeVarintNum(map.size)
    for (let item of map.entries()) {
      this.writeString(item[0])
      this.writeVarInt(8, item[1])
    }
  }
}

// write the buf len and buf
WriterHelper.prototype.writeBuf = function (value) {
  var len = 0
  if (!_.isEmpty(value)) {
    assert(bufferUtil.isBuffer(value))
    len = value.length
  }
  this.writeVarintNum(len)
  if (len > 0) {
    this.write(value)
  }
};

WriterHelper.prototype.writeRegId = function (value) {
  var regIdData = Util.splitRegID(value)

  var intWriter = new WriterHelper()
  intWriter.writeVarInt(4, regIdData.height)
  intWriter.writeVarInt(2, regIdData.index)
  this.writeBuf(intWriter.toBuffer())
};

WriterHelper.prototype.VoteOperType = {
  ADD_FUND: 1,       //!< add operate
  MINUS_FUND: 2      //!< minus operate
}

/**
 * delegateData    array,  item is object data of delegate
 * [
 *     {
 *         publicKey: string    the public key that the votes are received,
 *         votes: number        vote number
 *     },
 *]
 */
WriterHelper.prototype.writeDelegateData = function (delegateData) {

  this.writeVarintNum(delegateData.length);

  for (var i = 0; i < delegateData.length; i++) {
    var operType = this.VoteOperType.ADD_FUND;
    if (delegateData[0].votes < 0) {
      operType = this.VoteOperType.MINUS_FUND;
    }
    var votes_abs = Math.abs(delegateData[i].votes);
    this.writeUInt8(operType);
    if (delegateData[i].publicKey.indexOf("-") > -1) {
      this.writeRegId(delegateData[i].publicKey)
    } else {
      this.writeString(Buffer.from(delegateData[i].publicKey, 'hex'));
    }
    this.writeVarInt(8, votes_abs)
  }
}

WriterHelper.prototype.writeDestArrData = function (destArr, network) {

  this.writeVarintNum(destArr.length);

  for (var i = 0; i < destArr.length; i++) {
    var addr = Address.fromString(destArr[i].destAddr, network, 'pubkeyhash')
    var size = addr.hashBuffer.length
    this.writeUInt8(size)
    this.write(addr.hashBuffer)
    this.writeString(destArr[i].coinType)
    this.writeVarInt(8, destArr[i].value)
  }
}

WriterHelper.prototype.writeAssetData = function (assetData, network) {
  this.writeString(assetData.assetSymbol)
  this.writeRegId(assetData.ownerRegid)
  this.writeString(assetData.assetName)
  var minTable = 1
  if (!assetData.modifiAble) minTable = 0
  this.writeUInt8(minTable)
  this.writeVarInt(8, assetData.totalSupply)
}

WriterHelper.prototype.UpdateAssetType = {
  UPDATE_NONE: 0,
  OWNER_UID: 1,
  NAME: 2,
  MINT_AMOUNT: 3,
}

WriterHelper.prototype.writeassetUpdateData = function (assetUpdateData, network) {
  var type = assetUpdateData.updateType
  switch (type) {
    case 1:
      this.writeUInt8(1)
      this.writeRegId(assetUpdateData.updateValue)
      break;
    case 2:
      this.writeUInt8(2)
      this.writeString(assetUpdateData.updateValue)
      break;
    case 3:
      this.writeUInt8(3)
      this.writeVarInt(8, assetUpdateData.updateValue)
      break;
  }
}

WriterHelper.prototype.writeFeedPriceData = function (feedPriceData) {

  this.writeVarintNum(feedPriceData.length);

  for (var i = 0; i < feedPriceData.length; i++) {
    var coinPriceType = feedPriceData[i].coinPriceType;
    var coinType = coinPriceType.coinType;
    var priceType = coinPriceType.priceType;

    var price = feedPriceData[i].price;
    this.writeVarintNum(coinType);
    this.writeVarintNum(priceType);
    this.writeVarInt(8, price)
  }
}

WriterHelper.prototype.writeDexSettleData = function (dexsettledata) {

  this.writeVarintNum(dexsettledata.length);

  for (var i = 0; i < dexsettledata.length; i++) {
    var buyOrderId = dexsettledata[i].buyOrderId;
    var sellOrderId = dexsettledata[i].sellOrderId;
    var dealPrice = dexsettledata[i].dealPrice;
    var dealCoinAmount = dexsettledata[i].dealCoinAmount;
    var dealAssetAmount = dexsettledata[i].dealAssetAmount;

    var buyOrderIdBuf = new Buffer.from(buyOrderId, 'hex');
    this.writeVarintNum(buyOrderIdBuf.length);
    this.write(bufferUtil.reverse(buyOrderIdBuf));

    var sellOrderIdBuf = new Buffer.from(sellOrderId, 'hex');
    this.writeVarintNum(sellOrderIdBuf.length);
    this.write(bufferUtil.reverse(sellOrderIdBuf));

    this.writeVarInt(8, dealPrice);
    this.writeVarInt(8, dealCoinAmount);
    this.writeVarInt(8, dealAssetAmount);
  }
}

WriterHelper.prototype.PriceType = {
  USD: 0,
  CNY: 1,
  EUR: 2,
  BTC: 10,
  USDT: 11,
  GOLD: 20,
  KWH: 100
}

WriterHelper.prototype.CoinType = {
  WICC: "WICC",
  WGRT: "WGRT",
  WUSD: "WUSD",
  WCNY: "WCNY",

  WBTC: "WBTC",
  WETH: "WETH",
  WEOS: "WEOS",

  USD: "USD",
  CNY: "CNY",
  EUR: "EUR",
  BTC: "BTC",
  USDT: "USDT",
  GOLD: "GOLD",
  KWH: "KWH",
}
WriterHelper.prototype.BalanceOpType = {
  NULL_OP: 0,
  ADD_FREE: 1,
  SUB_FREE: 2
}

export default WriterHelper;
