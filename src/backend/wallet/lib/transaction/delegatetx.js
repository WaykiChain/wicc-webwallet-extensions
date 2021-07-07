'use strict';

import _ from 'lodash';
import $ from '../util/preconditions';
import Util from '../util/util'
import Hash from '../crypto/hash';
import ECDSA from '../crypto/ecdsa';
import WriterHelper from '../util/writerhelper';
import errors from '../errors';

var DelegateTx = function DelegateTx(arg) {
  if (!(this instanceof DelegateTx)) {
    return new DelegateTx(arg);
  }
  var info = DelegateTx._from(arg);
  this.nTxType = info.nTxType;
  this.nVersion = info.nVersion;
  this.nValidHeight = info.nValidHeight;
  this.srcRegId = info.srcRegId;
  this.publicKey = info.publicKey;
  /**
   * delegateData    array,  item is object data of delegate
   * [
   *     {
   *         publicKey: string    the public key that the votes are received,
   *         votes: number        vote number
   *     },
   *]
   */
  this.delegateData = info.delegateData;
  this.fees = info.fees;

  return this;
};

DelegateTx._from = function _from(arg) {
  var info = {};
  if (_.isObject(arg)) {
    info = DelegateTx._fromObject(arg);
  } else {
    throw new TypeError('Unrecognized argument for DelegateTx');
  }
  return info;
};

DelegateTx._checkDelegateData = function _checkDelegateData(delegateData) {
  if (!_.isArray(delegateData) || _.isEmpty(delegateData)) {
    throw new errors.InvalidArgument("delegateData", "delegateData must be array and not empty.");
  }

  for (var i = 0; i < delegateData.length; i++) {
    var publicKey = delegateData[i].publicKey;

    var votes = delegateData[i].votes;
    //      if(!_.isBuffer(publicKey) || _.isEmpty(publicKey)) {
    //        throw new errors.InvalidArgument("delegateData", "delegateData[" + i + "].publicKey must be buffer or string, and not empty.");
    //      }
    if (typeof (publicKey) !== 'string' || _.isEmpty(publicKey)) {
      throw new errors.InvalidArgument("delegateData", "delegateData[" + i + "].publicKey must be string, and not empty.");
    }
    if (!_.isNumber(votes)) {
      throw new errors.InvalidArgument("delegateData", "delegateData[" + i + "].votes must be number.");
    }
  }
}


DelegateTx._fromObject = function _fromObject(data) {
  $.checkArgument(data, 'data is required');
  // if (!Util.checkRegId(data.srcRegId)) {
  //   throw new errors.InvalidArgument("srcRegId", "Invalid reg id");
  // }    
  DelegateTx._checkDelegateData(data.delegateData)

  var info = {
    nTxType: data.nTxType,
    nVersion: data.nVersion,
    nValidHeight: data.nValidHeight,
    srcRegId: data.srcRegId,
    delegateData: data.delegateData,
    publicKey: data.publicKey,
    fees: data.fees
  };
  return info;
};


DelegateTx.prototype._SignatureHash = function () {
  var writer = new WriterHelper();
  writer.writeVarInt(4, this.nVersion);
  writer.writeUInt8(this.nTxType);
  writer.writeVarInt(4, this.nValidHeight);
  //writer.writeRegId(this.srcRegId);

  if (this.srcRegId != null && !_.isEmpty(this.srcRegId)) {
    writer.writeRegId(this.srcRegId);
  } else if (this.publicKey != null && !_.isEmpty(this, this.publicKey)) {
    var pubKey = Buffer.from(this.publicKey, 'hex')
    writer.writeUInt8(pubKey.length)
    writer.write(pubKey)
  } else {
    return false;
  }

  writer.writeDelegateData(this.delegateData);
  writer.writeVarInt(8, this.fees);

  var serialBuf = writer.toBuffer();

  //console.log(serialBuf.toString('hex'))

  return Hash.sha256sha256(serialBuf);
}

DelegateTx.prototype._Signtx = function (privateKey) {
  var hashbuf = this._SignatureHash()
  var sig = ECDSA.sign(hashbuf, privateKey, 'endian')
  var sigBuf = sig.toBuffer()

  return sigBuf;
}

DelegateTx.prototype.SerializeTx = function (privateKey) {
  var writer = new WriterHelper();
  writer.writeUInt8(this.nTxType)
  writer.writeVarInt(4, this.nVersion)
  writer.writeVarInt(4, this.nValidHeight)
  // writer.writeRegId(this.srcRegId)
  if (this.srcRegId != null && !_.isEmpty(this.srcRegId)) {
    writer.writeRegId(this.srcRegId);
  } else if (this.publicKey != null && !_.isEmpty(this, this.publicKey)) {
    var pubKey = Buffer.from(this.publicKey, 'hex')
    writer.writeUInt8(pubKey.length)
    writer.write(pubKey)
  } else {
    return false;
  }
  writer.writeDelegateData(this.delegateData)
  writer.writeVarInt(8, this.fees)
  var sigBuf = this._Signtx(privateKey)
  writer.writeBuf(sigBuf)

  var hexBuf = writer.toBuffer()
  var hex = hexBuf.toString('hex')

  return hex
}

export default DelegateTx;
