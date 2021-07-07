'use strict';
//cdp创建
import _ from 'lodash';
import $ from '../util/preconditions';
import Util from '../util/util'
import Hash from '../crypto/hash';
import ECDSA from '../crypto/ecdsa';
import BufferWriter from '../encoding/bufferwriter';
import WriterHelper from '../util/writerhelper';

var CdpStakeTx = function CdpStakeTx(arg) {
  if (!(this instanceof CdpStakeTx)) {
    return new CdpStakeTx(arg);
  }
  var info = CdpStakeTx._from(arg);
  this.nTxType = info.nTxType;
  this.nVersion = info.nVersion;
  this.nValidHeight = info.nValidHeight;
  this.txUid = info.txUid;
  this.fees = info.fees;
  this.cdpTxId = info.cdpTxId;
  this.assetMap = info.assetMap;
  this.scoinsToMint = info.scoinsToMint;
  this.fee_symbol = info.fee_symbol;
  this.scoin_symbol = info.scoin_symbol,
    this.publicKey = info.publicKey,
    this.network = info.network;

  return this;
};

CdpStakeTx._from = function _from(arg) {
  var info = {};
  if (_.isObject(arg)) {
    info = CdpStakeTx._fromObject(arg);
  } else {
    throw new TypeError('Unrecognized argument for CommonTx');
  }
  return info;
};

CdpStakeTx._fromObject = function _fromObject(data) {
  $.checkArgument(data, 'data is required');

  var info = {
    nTxType: data.nTxType,
    nVersion: data.nVersion,
    nValidHeight: data.nValidHeight,
    txUid: data.txUid,
    fees: data.fees,
    cdpTxId: data.cdpTxId,
    assetMap: data.assetMap,
    scoinsToMint: data.scoinsToMint,
    fee_symbol: data.fee_symbol,
    scoin_symbol: data.scoin_symbol,
    publicKey: data.publicKey,
  };
  return info;
};

CdpStakeTx.prototype._SignatureHash = function () {
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

  if (this.cdpTxId == null) { this.cdpTxId = "0000000000000000000000000000000000000000000000000000000000000000" }
  var cdpTxidBuf = new Buffer.from(this.cdpTxId, 'hex')
  writer.writeReverse(cdpTxidBuf)

  writer.writeCdpAsset(this.assetMap)

  if (this.scoin_symbol == null || _.isEmpty(this.scoin_symbol)) return fasle;
  writer.writeString(this.scoin_symbol)

  if (! /^[0-9]*[0-9][0-9]*$/.test(this.scoinsToMint))
    return false;
  var scoinsToMintBuf = Util.writeVarInt(8, this.scoinsToMint)
  writer.write(scoinsToMintBuf)

  var serialBuf = writer.toBuffer()

  //console.log(serialBuf.toString('hex'))
  return Hash.sha256sha256(serialBuf);
}

CdpStakeTx.prototype._Signtx = function (privateKey) {
  var hashbuf = this._SignatureHash()
  var sig = ECDSA.sign(hashbuf, privateKey, 'endian')
  var sigBuf = sig.toBuffer()

  return sigBuf;
}

CdpStakeTx.prototype.SerializeTx = function (privateKey) {
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

  if (this.cdpTxId == null) { this.cdpTxId = "0000000000000000000000000000000000000000000000000000000000000000" }
  var cdpTxidBuf = new Buffer.from(this.cdpTxId, 'hex')
  writer.writeReverse(cdpTxidBuf)

  writer.writeCdpAsset(this.assetMap)

  if (this.scoin_symbol == null || _.isEmpty(this.scoin_symbol)) return fasle;
  writer.writeString(this.scoin_symbol)

  if (! /^[0-9]*[0-9][0-9]*$/.test(this.scoinsToMint))
    return false;
  var scoinsToMintBuf = Util.writeVarInt(8, this.scoinsToMint)
  writer.write(scoinsToMintBuf)


  var sigBuf = this._Signtx(privateKey)

  var len = sigBuf.length
  writer.writeVarintNum(len)
  writer.write(sigBuf)


  var hexBuf = writer.toBuffer()
  var hex = hexBuf.toString('hex')

  return hex
}


export default CdpStakeTx;