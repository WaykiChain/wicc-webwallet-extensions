'use strict';

import _ from 'lodash';
import $ from '../util/preconditions';
import Util from '../util/util'
import Hash from '../crypto/hash';
import ECDSA from '../crypto/ecdsa';
import BufferWriter from '../encoding/bufferwriter';
import bufferUtil from '../util/buffer';
import WriterHelper from '../util/writerhelper';

var UCoinTransferTx = function UCoinTransferTx(arg) {
  if (!(this instanceof UCoinTransferTx)) {
    return new UCoinTransferTx(arg);
  }
  var info = UCoinTransferTx._from(arg);
  this.nTxType = info.nTxType;
  this.nVersion = info.nVersion;
  this.nValidHeight = info.nValidHeight;
  this.srcRegId = info.srcRegId;
  this.destArr = info.destArr;
  this.fees = info.fees;
  this.publicKey = info.publicKey;
  this.feesCoinType = info.feesCoinType;
  this.memo = info.memo;
  this.network = info.network;

  return this;
};

UCoinTransferTx._from = function _from(arg) {
  var info = {};
  if (_.isObject(arg)) {
    info = UCoinTransferTx._fromObject(arg);
  } else {
    throw new TypeError('Unrecognized argument for UCoinTransferTx');
  }
  return info;
};

UCoinTransferTx._fromObject = function _fromObject(data) {
  $.checkArgument(data, 'data is required');

  var info = {
    nTxType: data.nTxType,
    nVersion: data.nVersion,
    nValidHeight: data.nValidHeight,
    srcRegId: data.srcRegId,
    destArr: data.destArr,
    fees: data.fees,
    publicKey: data.publicKey,
    feesCoinType: data.feesCoinType,
    memo: data.memo
  };
  return info;
};

UCoinTransferTx.prototype._SignatureHash = function () {
  var writer = new WriterHelper();
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

  if (this.feesCoinType == null || _.isEmpty(this.feesCoinType)) return fasle;
  writer.writeString(this.feesCoinType)

  var feesBuf = Util.writeVarInt(8, this.fees)
  writer.write(feesBuf)
  writer.writeDestArrData(this.destArr)
  var len = 0
  var buf = this.memo
  if (!_.isEmpty(this.memo)) {
    if (!bufferUtil.isBuffer(buf)) {
      buf = Buffer.from(buf)
    }
    len = buf.length
  }
  writer.writeVarintNum(len)
  if (len > 0) {
    writer.write(buf)
  }

  var serialBuf = writer.toBuffer()

  return Hash.sha256sha256(serialBuf);
}

UCoinTransferTx.prototype._Signtx = function (privateKey) {
  var hashbuf = this._SignatureHash()
  var sig = ECDSA.sign(hashbuf, privateKey, 'endian')
  var sigBuf = sig.toBuffer()

  return sigBuf;
}

UCoinTransferTx.prototype.SerializeTx = function (privateKey) {
  var writer = new WriterHelper();
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

  if (this.feesCoinType == null || _.isEmpty(this.feesCoinType)) return fasle;
  writer.writeString(this.feesCoinType)

  if (! /^[1-9]*[1-9][0-9]*$/.test(this.fees))
    return false;
  var feesBuf = Util.writeVarInt(8, this.fees)
  writer.write(feesBuf)
  writer.writeDestArrData(this.destArr)
  var len = 0
  var buf = this.memo
  if (!_.isEmpty(this.memo)) {
    if (!bufferUtil.isBuffer(buf)) {
      buf = Buffer.from(buf)
    }
    len = buf.length
  }
  writer.writeVarintNum(len)
  if (len > 0) {
    writer.write(buf)
  }



  var sigBuf = this._Signtx(privateKey)

  var len = sigBuf.length
  writer.writeVarintNum(len)
  writer.write(sigBuf)


  var hexBuf = writer.toBuffer()
  var hex = hexBuf.toString('hex')

  return hex
}


export default UCoinTransferTx;