'use strict';

import _ from 'lodash';
import $ from '../util/preconditions';
import Util from '../util/util'
import BN from '../crypto/bn';
import Hash from '../crypto/hash';
import ECDSA from '../crypto/ecdsa';
import Signature from '../crypto/signature';
import BufferWriter from '../encoding/bufferwriter';
import Address from '../address'

var DexSellMarketOrderTx = function DexSellMarketOrderTx(arg) {
  if (!(this instanceof DexSellMarketOrderTx)) {
    return new DexSellMarketOrderTx(arg);
  }
  var info = DexSellMarketOrderTx._from(arg);
  this.nTxType = info.nTxType;
  this.nVersion = info.nVersion;
  this.nValidHeight = info.nValidHeight;
  this.fees = info.fees;
  this.srcRegId = info.srcRegId;
  this.coinSymbol = info.coinSymbol;
  this.assetSymbol = info.assetSymbol;
  this.assetAmount = info.assetAmount;
  this.feeSymbol = info.feeSymbol;
  this.publicKey = info.publicKey;
  this.network = info.network;

  return this;
};

DexSellMarketOrderTx._from = function _from(arg) {
  var info = {};
  if (_.isObject(arg)) {
    info = DexSellMarketOrderTx._fromObject(arg);
  } else {
    throw new TypeError('Unrecognized argument for CommonTx');
  }
  return info;
};

DexSellMarketOrderTx._fromObject = function _fromObject(data) {
  $.checkArgument(data, 'data is required');

  var info = {
    nTxType: data.nTxType,
    nVersion: data.nVersion,
    nValidHeight: data.nValidHeight,
    fees: data.fees,
    srcRegId: data.srcRegId,
    coinSymbol: data.coinSymbol,
    assetSymbol: data.assetSymbol,
    assetAmount: data.assetAmount,
    publicKey: data.publicKey,
    feeSymbol: data.feeSymbol
  };
  return info;
};

DexSellMarketOrderTx.prototype._SignatureHash = function () {
  var writer = new BufferWriter();
  writer.writeVarintNum(this.nVersion)
  writer.writeVarintNum(this.nTxType)
  var heightBuf = Util.writeVarInt(4, this.nValidHeight)
  writer.write(heightBuf)


  if (this.srcRegId != null && !_.isEmpty(this.srcRegId)) {
    var REGID = Util.splitRegID(this.srcRegId)
    if (_.isNull(REGID.height) || _.isUndefined(REGID.height))
      return false
    var regWriter = new BufferWriter()
    var regHeightBuf = Util.writeVarInt(4, REGID.height)
    regWriter.write(regHeightBuf)
    var regIndexBuf = Util.writeVarInt(2, REGID.index)
    regWriter.write(regIndexBuf)

    var regBuf = regWriter.toBuffer()
    writer.writeUInt8(regBuf.length)
    writer.write(regBuf)
  } else if (this.publicKey != null && !_.isEmpty(this, this.publicKey)) {
    var pubKey = Buffer.from(this.publicKey, 'hex')
    writer.writeUInt8(pubKey.length)
    writer.write(pubKey)
  } else {
    return false;
  }

  if (this.feeSymbol == null || _.isEmpty(this.feeSymbol)) return fasle;
  writer.writeString(this.feeSymbol)

  var feesBuf = Util.writeVarInt(8, this.fees)
  writer.write(feesBuf)

  if (this.coinSymbol.isNull || _.isEmpty(this.coinSymbol)) return false
  writer.writeString(this.coinSymbol)
  if (this.assetSymbol.isNull || _.isEmpty(this.assetSymbol)) return false
  writer.writeString(this.assetSymbol)

  var valueBuf = Util.writeVarInt(8, this.assetAmount)
  writer.write(valueBuf)


  var serialBuf = writer.toBuffer()

  // console.log(serialBuf.toString('hex'))

  return Hash.sha256sha256(serialBuf);
}

DexSellMarketOrderTx.prototype._Signtx = function (privateKey) {
  var hashbuf = this._SignatureHash()
  var sig = ECDSA.sign(hashbuf, privateKey, 'endian')
  var sigBuf = sig.toBuffer()

  return sigBuf;
}

DexSellMarketOrderTx.prototype.SerializeTx = function (privateKey) {
  var writer = new BufferWriter();
  writer.writeVarintNum(this.nTxType)
  writer.writeVarintNum(this.nVersion)
  var heightBuf = Util.writeVarInt(4, this.nValidHeight)
  writer.write(heightBuf)


  if (this.srcRegId != null && !_.isEmpty(this.srcRegId)) {
    var REGID = Util.splitRegID(this.srcRegId)
    if (_.isNull(REGID.height) || _.isUndefined(REGID.height))
      return false
    var regWriter = new BufferWriter()
    var regHeightBuf = Util.writeVarInt(4, REGID.height)
    regWriter.write(regHeightBuf)
    var regIndexBuf = Util.writeVarInt(2, REGID.index)
    regWriter.write(regIndexBuf)

    var regBuf = regWriter.toBuffer()
    writer.writeUInt8(regBuf.length)
    writer.write(regBuf)
  } else if (this.publicKey != null && !_.isEmpty(this, this.publicKey)) {
    var pubKey = Buffer.from(this.publicKey, 'hex')
    writer.writeUInt8(pubKey.length)
    writer.write(pubKey)
  } else {
    return false;
  }

  if (this.feeSymbol == null || _.isEmpty(this.feeSymbol)) return fasle;
  writer.writeString(this.feeSymbol)

  if (! /^[1-9]*[1-9][0-9]*$/.test(this.fees))
    return false;
  var feesBuf = Util.writeVarInt(8, this.fees)
  writer.write(feesBuf)

  if (this.coinSymbol.isNull || _.isEmpty(this.coinSymbol)) return false
  writer.writeString(this.coinSymbol)
  if (this.assetSymbol.isNull || _.isEmpty(this.assetSymbol)) return false
  writer.writeString(this.assetSymbol)

  var valueBuf = Util.writeVarInt(8, this.assetAmount)
  writer.write(valueBuf)

  var sigBuf = this._Signtx(privateKey)
  var len = sigBuf.length
  writer.writeVarintNum(len)
  writer.write(sigBuf)


  var hexBuf = writer.toBuffer()
  var hex = hexBuf.toString('hex')

  return hex
}


export default DexSellMarketOrderTx;