'use strict';

import _ from 'lodash';
import assert from "assert";
import $ from '../util/preconditions';
import Util from '../util/util'
import Hash from '../crypto/hash';
import ECDSA from '../crypto/ecdsa';
import WriterHelper from '../util/writerhelper';
import errors from '../errors';

var ContractTx = function ContractTx(arg) {
  if (!(this instanceof ContractTx)) {
    return new ContractTx(arg);
  }
  var info = ContractTx._from(arg);
  this.nTxType = info.nTxType;
  this.nVersion = info.nVersion;
  this.nValidHeight = info.nValidHeight;
  this.srcRegId = info.srcRegId;
  this.destRegId = info.destRegId;
  this.fees = info.fees;
  this.value = info.value;
  this.publicKey = info.publicKey;
  this.vContract = info.vContract;

  return this;
};

ContractTx._from = function _from(arg) {
  var info = {};
  if (_.isObject(arg)) {
    info = ContractTx._fromObject(arg);
  } else {
    throw new TypeError('Unrecognized argument for ContractTx');
  }
  return info;
};

ContractTx._fromObject = function _fromObject(data) {
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
    vContract: contract
  };
  return info;
};

ContractTx.prototype._SignatureHash = function () {
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
  writer.writeVarInt(8, this.fees)
  writer.writeVarInt(8, this.value)
  writer.writeString(Buffer.from(this.vContract))

  var serialBuf = writer.toBuffer()

  //console.log(serialBuf.toString('hex'))

  return Hash.sha256sha256(serialBuf);
}

ContractTx.prototype._Signtx = function (privateKey) {
  var hashbuf = this._SignatureHash()
  var sig = ECDSA.sign(hashbuf, privateKey, 'endian')
  var sigBuf = sig.toBuffer()

  return sigBuf;
}

ContractTx.prototype.SerializeTx = function (privateKey) {
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

  writer.writeVarInt(8, this.fees)
  writer.writeVarInt(8, this.value)

  writer.writeBuf(Buffer.from(this.vContract))

  var sigBuf = this._Signtx(privateKey)
  writer.writeBuf(sigBuf)

  var hexBuf = writer.toBuffer()
  var hex = hexBuf.toString('hex')

  return hex
}


export default ContractTx;
