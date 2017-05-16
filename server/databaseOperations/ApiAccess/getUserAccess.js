var mongoose = require('mongoose');
var ApiAccess = require('./../../../model/schemas/ApiAccess');

mongoose.Promise = global.Promise;

//  todo : Unexpected token _ in JSON at position 2
//  todo: authorization for analytics fails on line 122 googleAPI - app crashes
function getUserAccess(userID) {
  return new Promise(function (resolve, reject) {
    ApiAccess.findOne({ user: userID }).then(function (doc) {
      //  console.error(doc);
      resolve(doc._doc);
    }).catch(function (error) {
      console.error(error);
      reject(error);
    });
  });
}

module.exports = getUserAccess;