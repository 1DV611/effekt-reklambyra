var dotenv = require('dotenv');
var CryptoJS = require('crypto-js');

dotenv.load();

//  Dekrypterar strängar i ApiAccess.[provider].access-objektet från DB, exemplevis accessToken
exports.decryptText = function (cipherTextToString) {
  var decrypted = CryptoJS.AES.decrypt(cipherTextToString, process.env.CRYPTOJS_SECRET);
  return decrypted.toString(CryptoJS.enc.Utf8);
};
