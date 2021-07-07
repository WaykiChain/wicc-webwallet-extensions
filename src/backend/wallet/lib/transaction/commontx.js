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

var CommonTx = function CommonTx(arg) {
  if (!(this instanceof CommonTx)) {
    return new CommonTx(arg);
  }
  var info = CommonTx._from(arg);
  this.nTxType = info.nTxType;
  this.nVersion = info.nVersion;
  this.nValidHeight = info.nValidHeight;
  this.fees = info.fees;
  this.srcRegId = info.srcRegId;
  this.destAddr = info.destAddr;
  this.value = info.value;
  this.publicKey = info.publicKey;
  this.memo = info.memo;
  this.network = info.network;

  return this;
};

CommonTx._from = function _from(arg) {
  var info = {};
  if (_.isObject(arg)) {
    info = CommonTx._fromObject(arg);
  } else {
    throw new TypeError('Unrecognized argument for CommonTx');
  }
  return info;
};

CommonTx._fromObject = function _fromObject(data) {
  $.checkArgument(data, 'data is required');

  var info = {
    nTxType: data.nTxType,
    nVersion: data.nVersion,
    nValidHeight: data.nValidHeight,
    fees: data.fees,
    srcRegId: data.srcRegId,
    destAddr: data.destAddr,
    value: data.value,
    publicKey: data.publicKey,
    memo: data.memo
  };
  return info;
};

CommonTx.prototype._SignatureHash = function () {
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

  var addr = Address.fromString(this.destAddr, this.network, 'pubkeyhash')
  //console.log(addr.hashBuffer.toString('hex'))

  var size = addr.hashBuffer.length
  writer.writeUInt8(size)
  writer.write(addr.hashBuffer)

  var feesBuf = Util.writeVarInt(8, this.fees)
  writer.write(feesBuf)

  var valueBuf = Util.writeVarInt(8, this.value)
  writer.write(valueBuf)

  writer.writeString(this.memo)

  var serialBuf = writer.toBuffer()

  //console.log(serialBuf.toString('hex'))

  return Hash.sha256sha256(serialBuf);
}

CommonTx.prototype._Signtx = function (privateKey) {
  var hashbuf = this._SignatureHash()
  var sig = ECDSA.sign(hashbuf, privateKey, 'endian')
  var sigBuf = sig.toBuffer()

  return sigBuf;
}

CommonTx.prototype.SerializeTx = function (privateKey) {
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
  } else if (this.publicKey != null && !_.isEmpty(this.publicKey)) {
    var pubKey = Buffer.from(this.publicKey, 'hex')
    writer.writeUInt8(pubKey.length)
    writer.write(pubKey)
  } else {
    return false;
  }

  var addr = Address.fromString(this.destAddr, this.network, 'pubkeyhash')
  //console.log(addr.hashBuffer.toString('hex'))

  var size = addr.hashBuffer.length
  writer.writeUInt8(size)
  writer.write(addr.hashBuffer)

  if (! /^[1-9]*[1-9][0-9]*$/.test(this.fees))
    return false;

  var feesBuf = Util.writeVarInt(8, this.fees)
  writer.write(feesBuf)

  if (! /^[1-9]*[1-9][0-9]*$/.test(this.value))
    return false;

  var valueBuf = Util.writeVarInt(8, this.value)
  writer.write(valueBuf)

  writer.writeString(this.memo)

  var sigBuf = this._Signtx(privateKey)

  var len = sigBuf.length
  writer.writeVarintNum(len)
  writer.write(sigBuf)


  var hexBuf = writer.toBuffer()
  var hex = hexBuf.toString('hex')

  return hex
}


export default CommonTx;