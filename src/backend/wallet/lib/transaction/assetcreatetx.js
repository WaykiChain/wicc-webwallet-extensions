'use strict';

import _ from 'lodash';
import assert from "assert";
import $ from '../util/preconditions';
import Util from '../util/util'
import Hash from '../crypto/hash';
import ECDSA from '../crypto/ecdsa';
import WriterHelper from '../util/writerhelper';
import errors from '../errors';

var AssetCreateTx = function AssetCreateTx(arg) {
  if (!(this instanceof AssetCreateTx)) {
    return new AssetCreateTx(arg);
  }
  var info = AssetCreateTx._from(arg);
  this.nTxType = info.nTxType;
  this.nVersion = info.nVersion;
  this.nValidHeight = info.nValidHeight;
  this.srcRegId = info.srcRegId;
  this.fees = info.fees;
  this.feesCoinSymbol = info.feesCoinSymbol;
  this.assetData = info.assetData;

  return this;
};

AssetCreateTx._from = function _from(arg) {
  var info = {};
  if (_.isObject(arg)) {
    info = AssetCreateTx._fromObject(arg);
  } else {
    throw new TypeError('Unrecognized argument for ContractTx');
  }
  return info;
};

AssetCreateTx._fromObject = function _fromObject(data) {
  $.checkArgument(data, 'data is required');
  // if (!Util.checkRegId(data.srcRegId)) {
  //   throw new errors.InvalidArgument("srcRegId", "Invalid reg id");
  // }

  var info = {
    nTxType: data.nTxType,
    nVersion: data.nVersion,
    nValidHeight: data.nValidHeight,
    srcRegId: data.srcRegId,
    fees: data.fees,
    feesCoinSymbol: data.feesCoinSymbol,
    assetData: data.assetData,
  };
  return info;
};

AssetCreateTx.prototype._SignatureHash = function () {
  var writer = new WriterHelper();
  writer.writeVarInt(4, this.nVersion)
  writer.writeUInt8(this.nTxType)
  writer.writeVarInt(4, this.nValidHeight)

  if (this.srcRegId != null && !_.isEmpty(this.srcRegId)) {
    writer.writeRegId(this.srcRegId)
  } else {
    return false;
  }
  writer.writeString(Buffer.from(this.feesCoinSymbol))
  writer.writeVarInt(8, this.fees)

  var reg = /^[A-Z]{6,7}$/;
  if (!reg.test(this.assetData.assetSymbol))
    return false;
  writer.writeAssetData(this.assetData, this.network)

  var serialBuf = writer.toBuffer()

  //console.log(serialBuf.toString('hex'))

  return Hash.sha256sha256(serialBuf);
}

AssetCreateTx.prototype._Signtx = function (privateKey) {
  var hashbuf = this._SignatureHash()
  var sig = ECDSA.sign(hashbuf, privateKey, 'endian')
  var sigBuf = sig.toBuffer()

  return sigBuf;
}

AssetCreateTx.prototype.SerializeTx = function (privateKey) {
  var writer = new WriterHelper();
  writer.writeUInt8(this.nTxType)
  writer.writeVarInt(4, this.nVersion)
  writer.writeVarInt(4, this.nValidHeight)

  if (this.srcRegId != null && !_.isEmpty(this.srcRegId)) {
    writer.writeRegId(this.srcRegId)
  } else {
    return false;
  }
  writer.writeString(Buffer.from(this.feesCoinSymbol))
  writer.writeVarInt(8, this.fees)
  var reg = /^[A-Z]{6,7}$/;
  if (!reg.test(this.assetData.assetSymbol))
    return false
  writer.writeAssetData(this.assetData, this.network)

  var sigBuf = this._Signtx(privateKey)
  writer.writeBuf(sigBuf)

  var hexBuf = writer.toBuffer()
  var hex = hexBuf.toString('hex')

  return hex
}


export default AssetCreateTx;
