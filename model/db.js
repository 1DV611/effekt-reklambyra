var mongoose = require('mongoose');
var ApiAccess = require('./schemas/ApiAccess');
var ApiData = require('./schemas/ApiData');

mongoose.Promise = global.Promise;

//  Lars
function getUser(userID) {
  return new Promise(function (resolve, reject) {
    ApiAccess.findOne({ user: userID }).then(function (doc) {
      resolve(JSON.parse(doc));
    }).catch(function (error) {
      console.error(error);
      reject(error);
    });
  });
}

function convertToAPIArray(docs) {
  var accessObjects = [];
  docs.forEach(function (doc) {
    accessObjects.push(doc._doc);
  });

  return accessObjects;
}

function getAPIAccesses() {
  return new Promise(function (resolve, reject) {
    ApiAccess.find({}).then(function (docs) {
      resolve(convertToAPIArray(docs));
    }).catch(function (error) {
      reject(error);
    });
  });
}

function saveAPI(data) {
  console.log(data);
}

function getDataFor(user, month, year) {
  //  todo month and year are coming directly from querystring so these should be typechecked...
  return new Promise(function (resolve, reject) {
  });
}

exports.getUser = getUser;
exports.getAPIAccesses = getAPIAccesses;
exports.saveAPI = saveAPI;
exports.getDataFor = getDataFor;
