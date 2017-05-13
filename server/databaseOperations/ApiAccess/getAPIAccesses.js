var mongoose = require('mongoose');

var ApiAccess = require('./../../../model/schemas/ApiAccess');
var convertToAPIArray = require('./../../../server/helpers/convertToAPIArray');

mongoose.Promise = global.Promise;

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
