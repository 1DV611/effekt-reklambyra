'use strict';
//https://github.com/criso/fbgraph
var graph = require('fbgraph');

// API reference
//https://developers.facebook.com/docs/graph-api/reference/v2.2/user/likes
module.exports = function (profile) {
  var id = profile.id;
  var token = profile.accessToken;

  return new Promise(function (resolve, reject) {

    graph.setAccessToken(token);

    // https://developers.facebook.com/docs/graph-api/reference/v2.9/object/likes

    // that's pages user have liked.
    graph.get('/' + id + '/likes', function (err, res) {
      if (err) reject(err);

      resolve(42);
      console.log(res);
    });
  });
};