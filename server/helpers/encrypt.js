var dotenv = require('dotenv');
var CryptoJS = require('crypto-js');

dotenv.load();

//  Krypterar strängar till ApiAccess.[provider].access-objektet från DB, exemplevis accessToken
exports.encryptText = function (stringToCipherText) {
  var encrypted = CryptoJS.AES.encrypt(stringToCipherText, process.env.CRYPTOJS_SECRET);
  return encrypted.toString();
};
