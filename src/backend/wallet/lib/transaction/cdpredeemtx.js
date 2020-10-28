'use strict';
//cdp赎回
import _ from 'lodash';
import $ from '../util/preconditions';
import Util from '../util/util'
import Hash from '../crypto/hash';
import ECDSA from '../crypto/ecdsa';
import BufferWriter from '../encoding/bufferwriter';
import WriterHelper from '../util/writerhelper';

var CdpRedeemTx = function CdpRedeemTx(arg) {
  if (!(this instanceof CdpRedeemTx)) {
    return new CdpRedeemTx(arg);
  }
  var info = CdpRedeemTx._from(arg);
  this.nTxType = info.nTxType;
  this.nVersion = info.nVersion;
  this.nValidHeight = info.nValidHeight;
  this.txUid = info.txUid;
  this.fees = info.fees;
  this.cdpTxId = info.cdpTxId;
  this.scoins_to_repay = info.scoins_to_repay;
  this.assetMap = info.assetMap;
  this.fee_symbol = info.fee_symbol;
  this.publicKey = info.publicKey;
  this.network = info.network;

  return this;
};

CdpRedeemTx._from = function _from(arg) {
  var info = {};
  if (_.isObject(arg)) {
    info = CdpRedeemTx._fromObject(arg);
  } else {
    throw new TypeError('Unrecognized argument for CommonTx');
  }
  return info;
};

CdpRedeemTx._fromObject = function _fromObject(data) {
  $.checkArgument(data, 'data is required');

  var info = {
    nTxType: data.nTxType,
    nVersion: data.nVersion,
    nValidHeight: data.nValidHeight,
    txUid: data.txUid,
    fees: data.fees,
    cdpTxId: data.cdpTxId,
    scoins_to_repay: data.scoins_to_repay,
    assetMap: data.assetMap,
    publicKey: data.publicKey,
    fee_symbol: data.fee_symbol
  };
  return info;
};

CdpRedeemTx.prototype._SignatureHash = function () {
  var writer = new WriterHelper();
  writer.writeVarintNum(this.nVersion)
  writer.writeVarintNum(this.nTxType)
  var heightBuf = Util.writeVarInt(4, this.nValidHeight)
  writer.write(heightBuf)

  if (this.txUid != null && !_.isEmpty(this.txUid)) {
    var REGID = Util.splitRegID(this.txUid)
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

  if (this.fee_symbol == null || _.isEmpty(this.fee_symbol)) return fasle;
  writer.writeString(this.fee_symbol)

  var feesBuf = Util.writeVarInt(8, this.fees)
  writer.write(feesBuf)
  if (this.cdpTxId == null) return false
  var cdpTxidBuf = new Buffer.from(this.cdpTxId, 'hex')
  writer.writeReverse(cdpTxidBuf)

  if (! /^[0-9]*[0-9][0-9]*$/.test(this.scoins_to_repay))
    return false;
  var scoins_to_repayBuf = Util.writeVarInt(8, this.scoins_to_repay)
  writer.write(scoins_to_repayBuf)

  writer.writeCdpAsset(this.assetMap)

  var serialBuf = writer.toBuffer()
  // console.log(serialBuf.toString('hex'))
  return Hash.sha256sha256(serialBuf);
}

CdpRedeemTx.prototype._Signtx = function (privateKey) {
  var hashbuf = this._SignatureHash()
  var sig = ECDSA.sign(hashbuf, privateKey, 'endian')
  var sigBuf = sig.toBuffer()

  return sigBuf;
}

CdpRedeemTx.prototype.SerializeTx = function (privateKey) {
  var writer = new WriterHelper();
  writer.writeVarintNum(this.nTxType)
  writer.writeVarintNum(this.nVersion)
  var heightBuf = Util.writeVarInt(4, this.nValidHeight)
  writer.write(heightBuf)


  if (this.txUid != null && !_.isEmpty(this.txUid)) {
    var REGID = Util.splitRegID(this.txUid)
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

  if (this.fee_symbol == null || _.isEmpty(this.fee_symbol)) return fasle;
  writer.writeString(this.fee_symbol)

  if (! /^[1-9]*[1-9][0-9]*$/.test(this.fees))
    return false;
  var feesBuf = Util.writeVarInt(8, this.fees)
  writer.write(feesBuf)

  if (this.cdpTxId == null) return false
  var cdpTxidBuf = new Buffer.from(this.cdpTxId, 'hex')
  writer.writeReverse(cdpTxidBuf)

  if (! /^[0-9]*[0-9][0-9]*$/.test(this.scoins_to_repay))
    return false;
  var scoins_to_repayBuf = Util.writeVarInt(8, this.scoins_to_repay)
  writer.write(scoins_to_repayBuf)

  writer.writeCdpAsset(this.assetMap)

  var sigBuf = this._Signtx(privateKey)

  var len = sigBuf.length
  writer.writeVarintNum(len)
  writer.write(sigBuf)


  var hexBuf = writer.toBuffer()
  var hex = hexBuf.toString('hex')

  return hex
}


export default CdpRedeemTx;