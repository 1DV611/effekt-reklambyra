'use strict';
//https://github.com/desmondmorris/node-twitter
var Twitter = require('twitter');
var dotenv = require('dotenv');

dotenv.load();

var client  = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

module.exports = function (profile) {
  //https://dev.twitter.com/rest/reference/get/followers/ids

  return new Promise(function (resolve, reject) {

    client.get('users/show', { user_id: profile.id, screen_name: profile.username }, function(error, result, response) {
      if (error) reject(error);
      resolve(result.followers_count);
    });

  });
};


