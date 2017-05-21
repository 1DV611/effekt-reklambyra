'use strict';
//https://github.com/criso/fbgraph
var graph = require('fbgraph');
var dotenv = require('dotenv');

dotenv.load();

// API reference
//https://developers.facebook.com/docs/graph-api/reference/v2.2/user/likes
//EAADFZA7f3ZCSkBAK5d3zPoZBl9DHYsHkr8q8Cwa3wq5N37mI0mDuKZBu9F9xeLkIAQYuQZBy9tkOf7JuYdKBrwn2NwJyqsGQ6r9N9GsIgoPtoyZBZCI4YbAtKjElBYEHf6olRvEF21MqTOfrixXhdHFgu3AVFj8qDEZD

module.exports = function (profile) {
  var id = profile.profile._json.id;
  var token = profile.accessToken;

  return new Promise(function (resolve) {

    graph.setAccessToken(token);
    graph.setAppSecret(process.env.FACEBOOK_APP_SECRET);

    // https://developers.facebook.com/docs/graph-api/reference/v2.9/object/likes
    // that's pages user have liked.
    graph.get('/' + id + '/ids_for_pages', function (err, res) {
      if (err) {
        resolve({});
        console.error('facebook api error: ', err);
        /**
         * facebook api error:  { message: '(#100) An owning business is required for this request',
  type: 'OAuthException',
  code: 100,
  fbtrace_id: 'G2sI2u6fIT9' }
         */

      }
      ;

      var returnObj = {
        facebook: {
          likes: 42,
        }
      };

      resolve(returnObj);
    });
  });
};