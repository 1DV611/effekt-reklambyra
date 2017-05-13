var mongoose = require('mongoose');
var ApiAccess = require('./../../../model/schemas/ApiAccess');

mongoose.Promise = global.Promise;

function getUserAccess(userID) {
  return new Promise(function (resolve, reject) {
    ApiAccess.findOne({ user: userID }).then(function (doc) {
      resolve(JSON.parse(doc));
    }).catch(function (error) {
      console.error(error);
      reject(error);
    });
  });
}

module.exports = getUserAccess;