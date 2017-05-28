var dotenv = require('dotenv');
var CryptoJS = require('crypto-js');

dotenv.load();

exports.encryptText = function (stringToCipherText) {
  return CryptoJS.AES.encrypt(stringToCipherText, process.env.CRYPTOJS_SECRET);
};

exports.encryptObject = function (objectToCipherText) {
  return CryptoJS.AES.encrypt(JSON.stringify(objectToCipherText), process.env.CRYPTOJS_SECRET);
};
