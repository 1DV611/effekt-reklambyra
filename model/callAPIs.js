'use strict';
var googleAPI = require('./APIs/googleAPI');
var instagramAPI = require('./APIs/instagramAPI');
var linkedinAPI = require('./APIs/linkedinAPI');
var twitterAPI = require('./APIs/twitterAPI');
var facebookAPI = require('./APIs/facebookAPI');
var accrossAPI = require('./APIs/33acrossAPI');
var addThisAPI = require('./APIs/addThisAPI');


var APIResultsToObject = function (results) {
  var obj = {};

  results.forEach(function (result) {
    for (var property in result) {
      if (result.hasOwnProperty(property)) {
        obj[property] = result[property];
      }
    }
  });

  return obj;
};

// call all API's from user DB object credentials to get all data

/*
takes a user object from the db and check which API's it has profiles saved for.
Calls all API's using promises and finally resolves the array of data.
 */

var callAPIsWith = function (access) {

  return new Promise(function (resolve, reject) {

    var promises = [];

    if (access.twitter) promises.push(twitterAPI(access.twitter));

    if (access.facebook) promises.push(facebookAPI(access.facebook));

    if (access.linkedin) promises.push(linkedinAPI(access.linkedin));

    if (access.google) promises.push(googleAPI(access.google.accessToken));

    if (access.instagram) promises.push(instagramAPI(access.instagram));

    promises.push(accrossAPI());
    promises.push(addThisAPI());

    Promise.all(promises).then(function (apiData) {
      resolve(APIResultsToObject(apiData));
    }).catch(function (error) {
      reject(error);
    });
  });
};

exports.callAPIsWith = callAPIsWith;
