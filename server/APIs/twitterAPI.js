'use strict';

//  https://github.com/desmondmorris/node-twitter
var Twitter = require('twitter');
var decrypt = require('../helpers/decrypt');
var dotenv = require('dotenv');

dotenv.load();

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

module.exports = function (profile) {
  //  https://dev.twitter.com/rest/reference/get/followers/ids

  // not actually needed to authenticate twitter for this,
  // is enough with the screen name for the data
  // that you want.
  var userId = profile.id;
  var screenName = profile.extraParams.screen_name;

  return new Promise(function (resolve) {
    client.get('users/show', { user_id: userId, screen_name: screenName },
      function (error, result, response) {
      if (error) {
        console.error('twitter api error: ', error);
        resolve({ twitter: { error: error[0].message } });
      }

      var returnObj = {
        twitter: {
          followers: result.followers_count
        }
      };
      resolve(returnObj);
    });
  });
};
