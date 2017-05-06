'use strict';
//https://github.com/criso/fbgraph
var graph = require('fbgraph');

// API reference
//https://developers.facebook.com/docs/graph-api/reference/v2.2/user/likes
module.exports = function (profile) {
  var id = profile.id;
  var token = profile.accessToken;

  graph.setAccessToken(token);

  // the auth is working but this request returns no error but empty array, so probably an incorrectly formatted api call
  graph.get('/' + id + '/likes', function (err, res) {
    if (err) console.error(err);

    console.log(res);

  });

};