var dotenv = require('dotenv');
var CryptoJS = require('crypto-js');

dotenv.load();

exports.encryptText = function (stringToCipherText) {
  var encrypted = CryptoJS.AES.encrypt(stringToCipherText, process.env.CRYPTOJS_SECRET);
  return encrypted.toString();
};
