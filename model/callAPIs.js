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

exports.callAPIsWith = callAPIsWith;
