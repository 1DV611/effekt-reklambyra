'use strict';
//https://github.com/criso/fbgraph
var graph = require('fbgraph');
var dotenv = require('dotenv');
dotenv.load();

// API reference
//https://developers.facebook.com/docs/graph-api/reference/v2.2/user/likes
module.exports = function (profile) {
  var id = profile.profile._json.id;
  var token = profile.accessToken;

  return new Promise(function (resolve, reject) {

    graph.setAccessToken(token);

    graph.extendAccessToken({
      "access_token":    token,
       "client_id":      process.env.FACEBOOK_CLIENT_ID,
       "client_secret":  process.env.FACEBOOK_CLIENT_SECRET,
    }, function (err, facebookRes) {
      console.log(facebookRes);
    });

    // https://developers.facebook.com/docs/graph-api/reference/v2.9/object/likes
    // that's pages user have liked.
    graph.get('/' + id + '/likes', function (err, res) {
      if (err) {
        resolve({});
        console.error('facebook api error: ', err);
      };

      //todo actual facebook data here.. currently recieving an empty data array (no pages with likes?) need a real account to test
      var returnObj = {
        facebook: {
          likes: 42,
        }
      };

      resolve(returnObj);
    });
  });
};