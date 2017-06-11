var mongoose = require('mongoose');
var ApiAccess = require('../schemas/ApiAccess');

mongoose.Promise = global.Promise;

/**
 * Hämtar användarspecifikt APIAccess-objekt
 * @param userId
 */
function getUserAPIAccess(userId) {
  return new Promise(function (resolve, reject) {
    ApiAccess.findOne({
      user: userId,
    }).then(function (doc) {
      resolve(doc);
    }).catch(function (error) {
      reject(error);
    });
  });
}

module.exports = getUserAPIAccess;
