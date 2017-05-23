var mongoose = require('mongoose');
var ApiAccess = require('../schemas/ApiAccess');

mongoose.Promise = global.Promise;

//  todo : Unexpected token _ in JSON at position 2
//  todo: authorization for analytics fails on line 122 googleAPI - app crashes
/**
 * Hämtar ett ApiAccess-objekt
 * @param userID
 * @returns {Promise}
 */
function getUserAccess(userID) {
  return new Promise(function (resolve, reject) {
    ApiAccess.findOne({ user: userID }).then(function (doc) {
      resolve(doc._doc);
    }).catch(function (error) {
      reject(error);
    });
  });
}

module.exports = getUserAccess;
