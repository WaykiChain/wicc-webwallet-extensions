'use strict';

import _ from 'lodash';
import assert from "assert";
import $ from '../util/preconditions';
import Util from '../util/util'
import Hash from '../crypto/hash';
import ECDSA from '../crypto/ecdsa';
import WriterHelper from '../util/writerhelper';
import errors from '../errors';

var UContractTx = function UContractTx(arg) {
  if (!(this instanceof UContractTx)) {
    return new UContractTx(arg);
  }
  var info = UContractTx._from(arg);
  this.nTxType = info.nTxType;
  this.nVersion = info.nVersion;
  this.nValidHeight = info.nValidHeight;
  this.srcRegId = info.srcRegId;
  this.destRegId = info.destRegId;
  this.fees = info.fees;
  this.value = info.value;
  this.feesCoinType = info.feesCoinType;
  this.publicKey = info.publicKey;
  this.coinType = info.coinType;
  this.vContract = info.vContract;

  return this;
};

UContractTx._from = function _from(arg) {
  var info = {};
  if (_.isObject(arg)) {
    info = UContractTx._fromObject(arg);
  } else {
    throw new TypeError('Unrecognized argument for ContractTx');
  }
  return info;
};

UContractTx._fromObject = function _fromObject(data) {
  $.checkArgument(data, 'data is required');
  // if (!Util.checkRegId(data.srcRegId)) {
  //   throw new errors.InvalidArgument("srcRegId", "Invalid reg id");
  // }
  if (!Util.checkRegId(data.destRegId)) {
    throw new errors.InvalidArgument("destRegId", "Invalid reg id");
  }
  if (!_.isString(data.vContract) || _.isEmpty(data.vContract)) {
    throw new errors.InvalidArgument("vContract", "Invalid vContract");
  }

  var contract = Util.hexToBytes(data.vContract)
  if (!contract) {
    throw new errors.InvalidArgument("vContract", "Invalid vContract");
  }

  var info = {
    nTxType: data.nTxType,
    nVersion: data.nVersion,
    nValidHeight: data.nValidHeight,
    srcRegId: data.srcRegId,
    destRegId: data.destRegId,
    fees: data.fees,
    value: data.value,
    publicKey: data.publicKey,
    coinType: data.coinType,
    feesCoinType: data.feesCoinType,
    vContract: contract
  };
  return info;
};

UContractTx.prototype._SignatureHash = function () {
  var writer = new WriterHelper();
  writer.writeVarInt(4, this.nVersion)
  writer.writeUInt8(this.nTxType)
  writer.writeVarInt(4, this.nValidHeight)

  if (this.srcRegId != null && !_.isEmpty(this.srcRegId)) {
    writer.writeRegId(this.srcRegId)
  } else if (this.publicKey != null && !_.isEmpty(this, this.publicKey)) {
    var pubKey = Buffer.from(this.publicKey, 'hex')
    writer.writeUInt8(pubKey.length)
    writer.write(pubKey)
  } else {
    return false;
  }

  writer.writeRegId(this.destRegId)
  writer.writeString(Buffer.from(this.vContract))
  writer.writeVarInt(8, this.fees)
  writer.writeString(Buffer.from(this.feesCoinType))
  writer.writeString(Buffer.from(this.coinType))
  writer.writeVarInt(8, this.value)

  var serialBuf = writer.toBuffer()

  //console.log(serialBuf.toString('hex'))

  return Hash.sha256sha256(serialBuf);
}

UContractTx.prototype._Signtx = function (privateKey) {
  var hashbuf = this._SignatureHash()
  var sig = ECDSA.sign(hashbuf, privateKey, 'endian')
  var sigBuf = sig.toBuffer()

  return sigBuf;
}

UContractTx.prototype.SerializeTx = function (privateKey) {
  var writer = new WriterHelper();
  writer.writeUInt8(this.nTxType)
  writer.writeVarInt(4, this.nVersion)
  writer.writeVarInt(4, this.nValidHeight)

  if (this.srcRegId != null && !_.isEmpty(this.srcRegId)) {
    writer.writeRegId(this.srcRegId)
  } else if (this.publicKey != null && !_.isEmpty(this, this.publicKey)) {
    var pubKey = Buffer.from(this.publicKey, 'hex')
    writer.writeUInt8(pubKey.length)
    writer.write(pubKey)
  } else {
    return false;
  }
  writer.writeRegId(this.destRegId)
  writer.writeString(Buffer.from(this.vContract))
  writer.writeVarInt(8, this.fees)
  writer.writeString(Buffer.from(this.feesCoinType))
  writer.writeString(Buffer.from(this.coinType))
  writer.writeVarInt(8, this.value)

  var sigBuf = this._Signtx(privateKey)
  writer.writeBuf(sigBuf)

  var hexBuf = writer.toBuffer()
  var hex = hexBuf.toString('hex')

  return hex
}


export default UContractTx;
