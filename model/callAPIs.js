'use strict';
var googleAPI = require('./APIs/googleAPI');
var instagramAPI = require('./APIs/instagramAPI');
var linkedinAPI = require('./APIs/linkedinAPI');
var twitterAPI = require('./APIs/twitterAPI');
var facebookAPI = require('./APIs/facebookAPI');

// call all API's from user DB object credentials to get all data


/*
takes a user object from the db and check which API's it has profiles saved for.
Calls all API's using promises and finally resolves the array of data.
 */
var callAPIsFor = function (user) {

  return new Promise(function (resolve, reject) {

    var promises = [];

    if (user.twitter) promises.push(twitterAPI(user.twitter));

    if (user.facebook) promises.push(facebookAPI(user.facebook));

    if (user.linkedin) promises.push(linkedinAPI(user.linkedin));

    if (user.google) promises.push(googleAPI(user.google.accessToken));

    if (user.instagram) promises.push(instagramAPI(user.instagram));

    Promise.all(promises).then(function (apiData) {
      resolve(apiData);

    }).catch(function (error) {
      reject(error)
    })

  });
};


exports.callAPIsFor = callAPIsFor;