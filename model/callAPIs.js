'use strict';
var googleAPI = require('./APIs/googleAPI');
var instagramAPI = require('./APIs/instagramAPI');
var linkedinAPI = require('./APIs/linkedinAPI');
var twitterAPI = require('./APIs/twitterAPI');
var facebookAPI = require('./APIs/facebookAPI');
var accrossAPI = require('./APIs/33acrossAPI');
var addThisAPI = require('./APIs/addThisAPI');

/**

 takes a user object from the db and check which API's it has profiles saved for.
 Calls all API's using promises and finally resolves the array of data.

 None of the API functions reject the promise on error, so that the dataobject is returned even
 if one of them rejects.

 */

var callAPIsWith = function (access) {

  return new Promise(function (resolve, reject) {

    var promises = [];

    if (access.twitter) promises.push(twitterAPI(access.twitter));

    if (access.facebook) promises.push(facebookAPI(access.facebook));

    if (access.linkedin) promises.push(linkedinAPI(access.linkedin));

    if (access.google) promises.push(googleAPI(access.google.accessToken));

    if (access.instagram) promises.push(instagramAPI(access.instagram));

    if (access.tynt) promises.push(accrossAPI(access.tynt));

    if (access.addthis) promises.push(addThisAPI(access.addthis));

    Promise.all(promises).then(function (apiData) {
      console.log(apiData);
      resolve(APIResultsToObject(apiData));

    }).catch(function (error) {
      reject(error);
    });
  });
};

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

exports.callAPIsWith = callAPIsWith;