'use strict';


var googleAPI = require('./APIs/googleAPI');
var instagramAPI = require('./APIs/instagramAPI');
var linkedinAPI = require('./APIs/linkedinAPI');
var twitterAPI = require('./APIs/twitterAPI');
var facebookAPI = require('./APIs/facebookAPI');

//temporary to send each token onto the api
var sendToApi = function (profile) {
  console.log(profile);
  switch (profile.provider) {
    case 'google':
      googleAPI(profile.accessToken);
      break;

    case 'instagram':
      instagramAPI(profile);
      break;

    case 'linkedin':
      linkedinAPI(profile.accessToken);
      break;

    case 'twitter':
      twitterAPI(profile);
      break;

    case 'facebook':
      facebookAPI(profile);
      break;
  }

};

function callAllAPIsFor(user) {

}

exports.callAllAPIsFor = callAllAPIsFor;