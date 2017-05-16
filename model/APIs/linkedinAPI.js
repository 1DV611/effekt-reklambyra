'use strict';
var dotenv = require('dotenv');
dotenv.load();
var nodeLinkedin = require('node-linkedin')(process.env.LINKEDIN_CLIENT_ID, process.env.LINKEDIN_CLIENT_SECRET, process.env.BASE_URL + '/auth/linkedin/callback');

module.exports = function (token) {

  return new Promise(function (resolve, reject) {

    var linkedin = nodeLinkedin.init(token);

    linkedin.connections.retrieve(function (err, connections) {
      if (err) {
        reject(err);
        console.error('instagram api error: ', err);
      };

      console.log(connections);
      var returnObj = {
        linkedin: {
          followers: 42,
          interactions: 42,
        }
      };

      resolve(returnObj);

    });
  });
};
