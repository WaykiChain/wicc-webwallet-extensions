'use strict';

import _ from 'lodash';
import $ from './util/preconditions';
import Mnemonic from './mnemonic'
import Address from './address'
import Random from './crypto/random'
import Hash from './crypto/hash'
import buffer from 'buffer'
import scrypt from 'scryptsy'
import aes from './aes-cbc'
import CryptoJS from 'crypto-js'
import HDPrivateKey from './hdprivatekey'
import CustomBuffer from './util/buffer'

var txMap = {
  2: {
    txName: 'ACCOUNT_REGISTER_TX',
    txAction: import('./transaction/registeraccounttx')
  },
  3: {
    txName: 'BCOIN_TRANSFER_TX',
    txAction: import('./transaction/commontx')
  },
  4: {
    txName: 'LCONTRACT_INVOKE_TX',
    txAction: import('./transaction/contracttx')
  },
  5: {
    txName: 'LCONTRACT_DEPLOY_TX',
    txAction: import('./transaction/registerapptx')
  },
  6: {
    txName: 'DELEGATE_VOTE_TX',
    txAction: import('./transaction/delegatetx')
  },
  9: {
    txName: 'ASSET_ISSUE_TX',
    txAction: import('./transaction/assetcreatetx')
  },
  10: {
    txName: 'ASSET_UPDATE_TX',
    txAction: import('./transaction/assetupdatetx')
  },

  11: {
    txName: 'UCOIN_TRANSFER_TX',
    txAction: import('./transaction/ucointransfertx')
  },
  15: {
    txName: 'UCOIN_CONTRACT_INVOKE_TX',
    txAction: import('./transaction/ucontractinvoketx')
  },
  21: {
    txName: 'CDP_STAKE_TX',
    txAction: import('./transaction/cdpstaketx')
  },
  22: {
    txName: 'CDP_REDEEMP_TX',
    txAction: import('./transaction/cdpredeemtx')
  },
  23: {
    txName: 'CDP_LIQUIDATE_TX',
    txAction: import('./transaction/cdpliquidatetx')
  },
  84: {
    txName: 'DEX_LIMIT_BUY_ORDER_TX',
    txAction: import('./transaction/dexbuylimitordertx')
  },
  85: {
    txName: ' DEX_LIMIT_SELL_ORDER_TX',
    txAction: import('./transaction/dexselllimitordertx')
  },
  86: {
    txName: 'DEX_MARKET_BUY_ORDER_TX',
    txAction: import('./transaction/dexbuymarketordertx')
  },
  87: {
    txName: 'DEX_MARKET_SELL_ORDER_TX',
    txAction: import('./transaction/dexsellmarketordertx')
  },
  88: {
    txName: 'DEX_CANCEL_ORDER_TX',
    txAction: import('./transaction/dexcancelordertx')
  }
}

var WiccApi = function WiccApi(arg) {
  if (!(this instanceof WiccApi)) {
    return new WiccApi(arg);
  }
  var info = WiccApi._from(arg);
  this.network = arg.network
  return this;
};

WiccApi._from = function _from(arg) {
  var info = {};
  if (_.isObject(arg)) {
    info = WiccApi._fromObject(arg);
  } else {
    throw new TypeError('Unrecognized argument for WiccApi');
  }
  return info;
};

WiccApi._fromObject = function _fromObject(data) {
  $.checkArgument(data, 'data is required');

  var info = {
    network: data.network
  };
  return info;
};

WiccApi.prototype.getBIP44Path = function () {
  return this.network === "testnet" ? "m/44'/99999'/0'/0/0" : "m/44'/99999'/0'/0/0"
}

WiccApi.prototype.createAllCoinMnemonicCode = function (language) {
  language = language || "ENGLISH"
  var code = new Mnemonic(Mnemonic.Words[language])
  var strCode = code.toString()

  return strCode
}

WiccApi.prototype.getMnemonicCodeLanguage = function (mnemonic) {
  let lang
  var dicts = Object.keys(Mnemonic.Words);
  for (var i = 0; i < dicts.length; i++) {
    var key = dicts[i];
    if (Mnemonic._belongsToWordlist(mnemonic, Mnemonic.Words[key])) {
      lang = key
      break
    }
  }
  return lang
}

WiccApi.prototype.switchMnemonicCode = function (mnemonic, targetLanguage) {
  if (!targetLanguage) return mnemonic
  var lang = ""
  var ret = []
  var indexArr = []
  var dicts = Object.keys(Mnemonic.Words);
  if (dicts.indexOf(targetLanguage) === -1) {
    throw `${targetLanguage} is not supported`
  }
  for (var i = 0; i < dicts.length; i++) {
    var key = dicts[i];
    if (Mnemonic._belongsToWordlist(mnemonic, Mnemonic.Words[key])) {
      lang = key
      break
    }
  }
  if (lang === targetLanguage) return mnemonic;
  var wordArr = mnemonic.split(" ")
  indexArr = wordArr.map(item => {
    return Mnemonic.Words[lang].indexOf(item)
  })
  indexArr.map(item => {
    ret.push(Mnemonic.Words[targetLanguage][item])
  })
  return ret.join(" ")
}

WiccApi.prototype.checkMnemonicCode = function (mnemonic) {
  return Mnemonic.isValid(mnemonic)
}

WiccApi.prototype.validateAddress = function (address) {
  return Address.isValid(address, this.network)
}

WiccApi.prototype.getPriKeyFromMnemonicCode = function (mnemonic) {
  mnemonic = this.switchMnemonicCode(mnemonic, "ENGLISH")
  var code = new Mnemonic(mnemonic)
  var xpriv = code.toHDPrivateKey(null, this.network);
  var p = xpriv.deriveChild(this.getBIP44Path());
  return p.privateKey.toWIF()
}

WiccApi.prototype.getAddressFromMnemonicCode = function (mnemonic) {
  mnemonic = this.switchMnemonicCode(mnemonic, "ENGLISH")
  var code = new Mnemonic(mnemonic)
  var xpriv = code.toHDPrivateKey(null, this.network);
  var p = xpriv.deriveChild(this.getBIP44Path());
  return p.privateKey.toAddress()
}

WiccApi.prototype.createWallet = function (mnemonic, password) {
  mnemonic = this.switchMnemonicCode(mnemonic, "ENGLISH")
  var salt = Random.getRandomBuffer(8)

  var passbuf = new buffer.Buffer(password, 'utf8');
  var hashpwd = Hash.sha256(passbuf)

  var code = new Mnemonic(mnemonic)
  var strCode = code.toString()

  var seed = code.toSeed()

  var xpriv = code.toHDPrivateKey(null, this.network);
  var p = xpriv.deriveChild(this.getBIP44Path());
  var address = p.privateKey.toAddress()
  var strAddress = address.toString()

  var d = new Date()
  var creationTimeSeconds = parseInt(d.getTime() / 1000)


  var data = scrypt(password, salt, 32768, 8, 1, 64)

  var key = data.slice(0, 32)
  var iv = data.slice(32, 48)

  var hexKey = key.toString('hex')
  var cryKey = CryptoJS.enc.Hex.parse(hexKey)

  var hexIv = iv.toString('hex')
  var cryIv = CryptoJS.enc.Hex.parse(hexIv)

  var strSeed = seed.toString('hex')
  var encryptedseed = aes.encrypt(cryKey, cryIv, strSeed)
  var encryptedMne = aes.encrypt(cryKey, cryIv, strCode)

  var encSeedData = {
    encryptedBytes: encryptedseed,
    iv: iv
  }

  var encMneData = {
    encryptedBytes: encryptedMne,
    iv: iv
  }

  var seedinfo = {
    encMneData: encMneData,
    encSeedData: encSeedData,
    creationTimeSeconds: creationTimeSeconds,
    hashPwd: hashpwd,
    salt: salt
  }

  var wallinfo = {
    seedinfo: seedinfo,
    symbol: 'WICC',
    address: strAddress
  }

  return wallinfo

}

WiccApi.prototype.getHDPriKeyFromSeed = function (seedinfo, password, addressIndex) {

  var passbuf = new buffer.Buffer(password, 'utf8');
  var hashpwd = Hash.sha256(passbuf)
  if (!CustomBuffer.equal(hashpwd, seedinfo.hashPwd)) {
    return null
  }

  var salt = seedinfo.salt
  var data = scrypt(password, salt, 32768, 8, 1, 64)

  var key = data.slice(0, 32)
  var iv = data.slice(32, 48)

  var hexKey = key.toString('hex')
  var cryKey = CryptoJS.enc.Hex.parse(hexKey)

  var hexIv = iv.toString('hex')
  var cryIv = CryptoJS.enc.Hex.parse(hexIv)

  var base64seed = seedinfo.encSeedData.encryptedBytes
  var strseed = aes.decrypt(cryKey, cryIv, base64seed)
  var seed = new Buffer(strseed, 'hex')

  var xpriv = HDPrivateKey.fromSeed(seed, this.network);
  var p = xpriv.deriveChild("m/44'/99999'/0'/0/" + addressIndex);

  return p.privateKey.toWIF()
}

WiccApi.prototype.getPriKeyFromSeed = function (seedinfo, password) {

  var passbuf = new buffer.Buffer(password, 'utf8');
  var hashpwd = Hash.sha256(passbuf)
  if (!CustomBuffer.equal(hashpwd, seedinfo.hashPwd)) {
    return null
  }

  var salt = seedinfo.salt
  var data = scrypt(password, salt, 32768, 8, 1, 64)

  var key = data.slice(0, 32)
  var iv = data.slice(32, 48)

  var hexKey = key.toString('hex')
  var cryKey = CryptoJS.enc.Hex.parse(hexKey)

  var hexIv = iv.toString('hex')
  var cryIv = CryptoJS.enc.Hex.parse(hexIv)

  var base64seed = seedinfo.encSeedData.encryptedBytes
  var strseed = aes.decrypt(cryKey, cryIv, base64seed)
  var seed = new Buffer(strseed, 'hex')
  /*
  var code = Mnemonic.fromSeed(seed, Mnemonic.Words.ENGLISH)
  var strCode = code.toString()

  var xpriv = code.toHDPrivateKey(null, 'testnet');
  */

  var xpriv = HDPrivateKey.fromSeed(seed, this.network);
  var p = xpriv.deriveChild(this.getBIP44Path());

  return p.privateKey.toWIF()
}

WiccApi.prototype.getMnemonicCodeFromSeed = function (seedinfo, password) {

  var passbuf = new buffer.Buffer(password, 'utf8');
  var hashpwd = Hash.sha256(passbuf)
  if (!CustomBuffer.equal(hashpwd, seedinfo.hashPwd)) {
    return null
  }

  var salt = seedinfo.salt
  var data = scrypt(password, salt, 32768, 8, 1, 64)

  var key = data.slice(0, 32)
  var iv = data.slice(32, 48)

  var hexKey = key.toString('hex')
  var cryKey = CryptoJS.enc.Hex.parse(hexKey)

  var hexIv = iv.toString('hex')
  var cryIv = CryptoJS.enc.Hex.parse(hexIv)

  var base64Mne = seedinfo.encMneData.encryptedBytes
  var Mne = aes.decrypt(cryKey, cryIv, base64Mne)

  return Mne
}

WiccApi.prototype.changePassword = function (seedinfo, oldpassword, newpassword) {

  var passbuf = new buffer.Buffer(oldpassword, 'utf8');
  var hashpwd = Hash.sha256(passbuf)
  if (!CustomBuffer.equal(hashpwd, seedinfo.hashPwd)) {
    return null
  }

  var salt = seedinfo.salt
  var data = scrypt(oldpassword, salt, 32768, 8, 1, 64)

  var key = data.slice(0, 32)
  var iv = data.slice(32, 48)

  var hexKey = key.toString('hex')
  var cryKey = CryptoJS.enc.Hex.parse(hexKey)

  var hexIv = iv.toString('hex')
  var cryIv = CryptoJS.enc.Hex.parse(hexIv)

  var base64seed = seedinfo.encSeedData.encryptedBytes
  var strseed = aes.decrypt(cryKey, cryIv, base64seed)
  var base64Mne = seedinfo.encMneData.encryptedBytes
  var Mne = aes.decrypt(cryKey, cryIv, base64Mne)

  var newpassbuf = new buffer.Buffer(newpassword, 'utf8');
  var newhashpwd = Hash.sha256(newpassbuf)

  data = scrypt(newpassword, salt, 32768, 8, 1, 64)

  key = data.slice(0, 32)
  iv = data.slice(32, 48)

  hexKey = key.toString('hex')
  cryKey = CryptoJS.enc.Hex.parse(hexKey)

  hexIv = iv.toString('hex')
  cryIv = CryptoJS.enc.Hex.parse(hexIv)

  var encryptedseed = aes.encrypt(cryKey, cryIv, strseed)
  var encryptedMne = aes.encrypt(cryKey, cryIv, Mne)

  var encSeedData = {
    encryptedBytes: encryptedseed,
    iv: iv
  }

  var encMneData = {
    encryptedBytes: encryptedMne,
    iv: iv
  }

  var newseedinfo = {
    encMneData: encMneData,
    encSeedData: encSeedData,
    creationTimeSeconds: seedinfo.creationTimeSeconds,
    hashPwd: newhashpwd,
    salt: salt
  }

  return newseedinfo
}

WiccApi.prototype.createSignTransaction = function (privkey, txData) {
  var txConstructor = txMap[txData.nTxType].txAction
  var txBody = new txConstructor(txData)
  return txBody.SerializeTx(privkey)
}

WiccApi.PROTOCAL_VERSION = 1;

//设置交易类型
// set transaction type
for (var item in txMap) {
  WiccApi[txMap[item].txName] = Number(item)
}

export default WiccApi;
