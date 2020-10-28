'use strict';

import _ from 'lodash';
import $ from '../util/preconditions';
import Util from '../util/util'
import BN from '../crypto/bn';
import Hash from '../crypto/hash';
import ECDSA from '../crypto/ecdsa';
import Signature from '../crypto/signature';
import BufferWriter from '../encoding/bufferwriter';

var RegisterAccountTx = function RegisterAccountTx(arg) {
  if (!(this instanceof RegisterAccountTx)) {
    return new RegisterAccountTx(arg);
  }
  var info = RegisterAccountTx._from(arg);
  this.nTxType = info.nTxType;
  this.nVersion = info.nVersion;
  this.nValidHeight = info.nValidHeight;
  this.fees = info.fees;
  this.pubkey = info.pubkey;
  this.minerPubkey = info.minerPubkey;


  return this;
};

RegisterAccountTx._from = function _from(arg) {
  var info = {};
  if (_.isObject(arg)) {
    info = RegisterAccountTx._fromObject(arg);
  } else {
    throw new TypeError('Unrecognized argument for RegisterAccountTx');
  }
  return info;
};

RegisterAccountTx._fromObject = function _fromObject(data) {
  $.checkArgument(data, 'data is required');

  var info = {
    nTxType: data.nTxType,
    nVersion: data.nVersion,
    nValidHeight: data.nValidHeight,
    fees: data.fees,
    pubkey: data.pubkey,
    minerPubkey: data.minerPubkey
  };
  return info;
};

RegisterAccountTx.prototype._SignatureHash = function () {
  var writer = new BufferWriter();
  writer.writeVarintNum(this.nVersion)
  writer.writeVarintNum(this.nTxType)
  var heightBuf = Util.writeVarInt(4, this.nValidHeight)
  writer.write(heightBuf)

  var pubkeyBuf = new Buffer(this.pubkey, 'hex')
  var len = pubkeyBuf.length
  writer.writeVarintNum(len)
  writer.write(pubkeyBuf);

  var minerBuf = new Buffer(this.minerPubkey, 'hex')
  len = minerBuf.length
  writer.writeVarintNum(len)
  if (len > 0) {
    writer.write(minerBuf);
  }

  var feesBuf = Util.writeVarInt(8, this.fees)
  writer.write(feesBuf)

  var serialBuf = writer.toBuffer()

  return Hash.sha256sha256(serialBuf);
}

RegisterAccountTx.prototype._Signtx = function (privateKey) {
  var hashbuf = this._SignatureHash()
  //console.log('hash buf: ' + hashbuf.toString('hex'))
  var sig = ECDSA.sign(hashbuf, privateKey, 'endian')
  var sigBuf = sig.toBuffer()

  return sigBuf;
}

RegisterAccountTx.prototype.SerializeTx = function (privateKey) {
  var writer = new BufferWriter();
  writer.writeVarintNum(this.nTxType)
  writer.writeVarintNum(this.nVersion)
  var heightBuf = Util.writeVarInt(4, this.nValidHeight)
  writer.write(heightBuf)

  var pubkeyBuf = new Buffer(this.pubkey, 'hex')
  var len = pubkeyBuf.length
  writer.writeVarintNum(len)
  writer.write(pubkeyBuf);

  var minerBuf = new Buffer(this.minerPubkey, 'hex')
  len = minerBuf.length
  writer.writeVarintNum(len)
  if (len > 0) {
    writer.write(minerBuf);
  }

  var feesBuf = Util.writeVarInt(8, this.fees)
  writer.write(feesBuf)

  var sigBuf = this._Signtx(privateKey)

  len = sigBuf.length
  writer.writeVarintNum(len)
  writer.write(sigBuf)

  var hexBuf = writer.toBuffer()
  var hex = hexBuf.toString('hex')

  return hex
}


export default RegisterAccountTx;
