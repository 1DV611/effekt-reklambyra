var mongoose = require('mongoose');

var ApiAccess = require('../schemas/ApiAccess');
var convertToAPIArray = require('../../helpers/convertToAPIArray');

mongoose.Promise = global.Promise;

/**
 * Hämtar alla APIAccess-objekt oavsett användare
 * @returns {Promise}
 */
function getAPIAccesses() {
  return new Promise(function (resolve, reject) {
    ApiAccess.find({}).then(function (docs) {
      resolve(convertToAPIArray(docs));
    }).catch(function (error) {
      reject(error);
    });
  });
}

module.exports = getAPIAccesses;
