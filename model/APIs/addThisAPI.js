'use strict';

var request = require('request');

module.exports = function () {
  // documentaion: http://www.addthis.com/academy/addthis-analytics-api/

  // Fill in the username and password variables to make it work.

  return new Promise(function (resolve, reject) {

    var username = '';
    var password = '';
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
        reject(err);
        console.log(err);
      } else {

        var returnObj = {
          addThis: {
            clicks: 42
          }
        };

        resolve(returnObj);
      }

      console.log(JSON.parse(body));
    });

  });

};
