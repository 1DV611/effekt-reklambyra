'use strict';
var googleAPI = require('./APIs/googleAPI');
var instagramAPI = require('./APIs/instagramAPI');
var linkedinAPI = require('./APIs/linkedinAPI');
var twitterAPI = require('./APIs/twitterAPI');
var facebookAPI = require('./APIs/facebookAPI');
var accrossAPI = require('./APIs/33acrossAPI');
var addThisAPI = require('./APIs/addThisAPI');
var APIResultsToObject = require('./../server/helpers/APIResultsToObject');

var callAPIsWith = function (access, startDate, endDate) {

  return new Promise(function (resolve, reject) {

    var promises = [];

    if (access.hasOwnProperty('twitter')) promises.push(twitterAPI(access.twitter, startDate, endDate));

    if (access.facebook) promises.push(facebookAPI(access.facebook, startDate, endDate));

    if (access.linkedin) promises.push(linkedinAPI(access.linkedin, startDate, endDate));

    if (access.google) promises.push(googleAPI(access.google.accessToken, startDate, endDate));

    if (access.instagram) promises.push(instagramAPI(access.instagram, startDate, endDate));

    if (access.tynt) promises.push(accrossAPI(access.tynt, startDate, endDate));

    if (access.addthis) promises.push(addThisAPI(access.addthis, startDate, endDate));

    Promise.all(promises).then(function (apiData) {
      resolve(APIResultsToObject(apiData));
    }).catch(function (error) {
      reject(error);
    });
  });
};

module.exports = callAPIsWith;
