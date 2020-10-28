'use strict';

import _ from 'lodash';
import $ from '../util/preconditions';
import Util from '../util/util'
import Hash from '../crypto/hash';
import ECDSA from '../crypto/ecdsa';
import WriterHelper from '../util/writerhelper';
import errors from '../errors';

var RegisterAppTx = function RegisterAppTx(arg) {
  if (!(this instanceof RegisterAppTx)) {
    return new RegisterAppTx(arg);
  }
  var info = RegisterAppTx._from(arg);
  this.nTxType = info.nTxType;
  this.nVersion = info.nVersion;
  this.nValidHeight = info.nValidHeight;
  this.regAcctId = info.regAcctId;
  this.script = info.script;
  this.scryptDesc = info.scriptDesc;
  this.publicKey = info.publicKey;
  this.fees = info.fees;

  return this;
};

RegisterAppTx._from = function _from(arg) {
  var info = {};
  if (_.isObject(arg)) {
    info = RegisterAppTx._fromObject(arg);
  } else {
    throw new TypeError('Unrecognized argument for RegisterAppTx');
  }
  return info;
};

RegisterAppTx._fromObject = function _fromObject(data) {
  $.checkArgument(data, 'data is required');
  // if (!Util.checkRegId(data.regAcctId)) {
  //   throw new errors.InvalidArgument("regAcctId", "Invalid reg id");
  // }

  var info = {
    nTxType: data.nTxType,
    nVersion: data.nVersion,
    nValidHeight: data.nValidHeight,
    regAcctId: data.regAcctId,
    script: data.script,
    scryptDesc: data.scriptDesc,
    publicKey: data.publicKey,
    fees: data.fees
  };

  return info;
};

RegisterAppTx.prototype._SignatureHash = function () {
  var writer = new WriterHelper();
  //writer.writeVarintNum(this.nVersion)
  // nVersion should use VARINT format
  writer.writeVarInt(4, this.nVersion)
  writer.writeUInt8(this.nTxType)
  writer.writeVarInt(4, this.nValidHeight)
  writer.writeRegId(this.regAcctId)
  // write script and desc
  var scriptWriter = new WriterHelper();
  scriptWriter.writeString(this.script)
  scriptWriter.writeString(this.scriptDesc)
  writer.writeBuf(scriptWriter.toBuffer())

  writer.writeVarInt(8, this.fees)


  var serialBuf = writer.toBuffer()

  //console.log(serialBuf.toString('hex'))

  return Hash.sha256sha256(serialBuf);
}

RegisterAppTx.prototype._Signtx = function (privateKey) {
  var hashbuf = this._SignatureHash()
  var sig = ECDSA.sign(hashbuf, privateKey, 'endian')
  var sigBuf = sig.toBuffer()

  return sigBuf;
}

RegisterAppTx.prototype.SerializeTx = function (privateKey) {
  var writer = new WriterHelper();
  writer.writeUInt8(this.nTxType)
  writer.writeVarintNum(this.nVersion)
  writer.writeVarInt(4, this.nValidHeight)
  writer.writeRegId(this.regAcctId)
  // write script and desc
  var scriptWriter = new WriterHelper();
  scriptWriter.writeString(this.script)
  scriptWriter.writeString(this.scriptDesc)
  writer.writeBuf(scriptWriter.toBuffer())

  writer.writeVarInt(8, this.fees)

  var sigBuf = this._Signtx(privateKey)
  writer.writeBuf(sigBuf)

  var hexBuf = writer.toBuffer()
  var hex = hexBuf.toString('hex')

  return hex
}


export default RegisterAppTx;