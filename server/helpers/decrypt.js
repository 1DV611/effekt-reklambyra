var dotenv = require('dotenv');
var CryptoJS = require('crypto-js');

dotenv.load();

exports.decryptText = function (cipherTextToString) {
  var bytes = CryptoJS.AES.decrypt(cipherTextToString.toString(), process.env.CRYPTOJS_SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};

exports.decryptObject = function (objectToCipherText) {
  var objectBytes = CryptoJS.AES.decrypt(
    objectToCipherText.toString(), process.env.CRYPTOJS_SECRET);
  return JSON.parse(objectBytes.toString(CryptoJS.enc.Utf8));
};
