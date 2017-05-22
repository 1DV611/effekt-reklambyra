'use strict';

var request = require('request');
var dotenv = require('dotenv');
dotenv.load();

module.exports = function () {
  // documentaion: http://www.addthis.com/academy/addthis-analytics-api/
  // Fill in the username and password variables to make it work.

  return new Promise(function (resolve) {

    var username = process.env.BYGGAUTE_USER;
    var password = process.env.BYGGAUTE_PW;
    var apiUrl = 'https://' + username + ':' + password + '@api.addthis.com/analytics/1.0/pub';
    // clicks or shares
    var metric = '/clicks';
    var dimension = '/domain';
    var format = '.json';
    var andPeriod = '?period=';
    var period = 'month';
    var andPubID = '&pubid=';
    var pubID = 'ra-514097954142f597';

    // https://<username>:<password>@api.addthis.com/analytics/1.0/pub/clicks/domain.json?period=month&pubid=ra-514097954142f597
    var queryString = apiUrl + metric + dimension + format + andPeriod + period + andPubID + pubID;
    request(queryString, function (err, res, body) {
      if (err) {
        resolve({});
        console.error('addthis api error: ', err);
      } else {

        try {
          //todo returns an array, in case there are several domains. Should we iterate and add each domain or...?
          var obj = JSON.parse(res.body);
          var clicks = obj[0].clicks;
          var returnObj = {
            addThis: {
              clicks: clicks,
            }
          };
          resolve(returnObj);

        } catch (e) {
          console.error('addthis API error', e);
          resolve({});
        }
      }
    });
  });
};
