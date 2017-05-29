var dotenv = require('dotenv');
var CryptoJS = require('crypto-js');

dotenv.load();

exports.decryptText = function (cipherTextToString) {
  var decrypted = CryptoJS.AES.decrypt(cipherTextToString, process.env.CRYPTOJS_SECRET);
  return decrypted.toString(CryptoJS.enc.Utf8);
};
