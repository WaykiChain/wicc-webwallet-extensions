import CryptoJS from 'crypto-js'

var cbcEncrypt = function (key, iv, textBytes) {

  var encrypted = CryptoJS.AES.encrypt(textBytes, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  var tmp = encrypted.toString()

  return tmp
}

var cbcDecrypt = function (key, iv, encryptedBytes) {
  var decrypted = '';
  decrypted = CryptoJS.AES.decrypt(encryptedBytes, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  var tmp = decrypted.toString(CryptoJS.enc.Utf8)

  return tmp

}


export default {
  encrypt: cbcEncrypt,
  decrypt: cbcDecrypt
}
