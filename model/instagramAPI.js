'use strict';
var instagram = require('instagram-node').instagram();
var dotenv = require('dotenv');
var instaAnalytics = require('instagram-analytics');



dotenv.load();

//https://www.npmjs.com/package/instagram-node
module.exports = function (profile) {
  var token = profile.accessToken;
  var userId = profile.id.toString();

  instaAnalytics(userId).then(function (stats) {
    console.log(stats);
  });

  instaAnalytics('mrwwwo').then(function (stats) {
    console.log(stats);
  });


  // console.log(token);
  //
  // instagram.use({
  //   access_token: token,
  //   client_id: process.env.INSTAGRAM_CLIENT_ID,
  //   client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
  // });
  //
  // instagram.user(userId, function (err, result, remaining, limit) {
  //   console.log(result);
  // });
  //
  //
  // instagram.user_self_liked([{count: 3}], function (err, medias, pagination, remaining, limit) {
  //   console.error(err);
  //   console.log(medias, pagination, remaining, limit);
  // });
  //
  // instagram.user_followers(userId, function (err, users, pagination, remaining, limit) {
  //   console.log(users);
  // });
  //
  // instagram.likes(userId, function (err, result, remaining, limit) {
  //   console.log(result);
  // });
  //
  // instagram.media_popular(function (err, medias, remaining, limit) {
  //   console.log(medias)
  // });
  //
  // instagram.user_self_feed([options], function (err, medias, pagination, remaining, limit) {
  //   console.log(medias);
  // });


};
