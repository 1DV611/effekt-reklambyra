'use strict';

var request = require('request');
var dateHelper = require('../../server/helpers/epochToDate');
var relevantDate;
var endpoints = ['/shares/day.json?period=month&pubid=',
  '/clicks/day.json?period=month&pubid=',
  '/subscriptions/day.json?period=month&pubid=',
  '/sharers/day.json?period=month&pubid=',
  '/influencers/day.json?period=month&pubid=',
  '/clickers/day.json?period=month&pubid=',
  '/users/day.json?period=month&pubid=',
];
var dotenv = require('dotenv');
dotenv.load();

function runApi(credentials, startDate, endDate) {
  var username = credentials.username;
  var password = credentials.password;
  var APIurl = 'https://' + username + ':' + password + '@api.addthis.com/analytics/1.0/pub';
  var pubID = 'ra-514097954142f597';
  relevantDate = dateHelper(startDate);
  var resultPromises = [];


  return new Promise(function (resolve) {

    endpoints.forEach(function (endpoint) {
      resultPromises.push(requestAPIData(APIurl, endpoint, pubID));
    });

    Promise.all(resultPromises).then(function (result) {
      resolve(result);
    })

  });
};

function getSomething(APIurl, pubID) {

  var resultPromises = [];

  return new Promise(function (resolve) {

    endpoints.forEach(function (endpoint) {
      resultPromises.push(requestAPIData(APIurl, endpoint, pubID));
    });

    Promise.all(resultPromises).then(function (result) {
      resolve(result);
    })

  });
  // request(APIurl + '/clicks/month.csv?period=year&pubid=' + pubID, standardCb);
  // request(APIurl + '/clicks/service.csv?period=week&pubid=' + pubID, standardCb);
  // request(APIurl + '/sharers/interest.csv?period=month&pubid=' + pubID, standardCb);
  // request(APIurl + '/shares/day.csv?period=week&pubid=' + pubID, standardCb);
  // request(APIurl + '/shares/url.csv?pubid=' + pubID, standardCb);
  // request(APIurl + '/shares/day.json?period=month&pubid=' + pubID, standardCb);
  // request(APIurl + '/clicks/day.json?period=month&pubid=' + pubID, standardCb);
  // request(APIurl + '/subscriptions/day.json?period=month&pubid=' + pubID, standardCb);
  // request(APIurl + '/sharers/day.json?period=month&pubid=' + pubID, standardCb);
  // request(APIurl + '/influencers/day.json?period=month&pubid=' + pubID, standardCb);
  // request(APIurl + '/clickers/day.json?period=month&pubid=' + pubID, standardCb);
  // request(APIurl + '/users/day.json?period=month&pubid=' + pubID, standardCb);

};

function requestAPIData(APIurl, endpoint, pubID) {
  return new Promise(function (resolve) {

    request(APIurl + endpoint + pubID, function (err, res, body) {

      if (res.body) {
        try {
          var obj = JSON.parse(res.body);
        } catch (e) {
          console.error(e);
        }
      }

      resolve(toFilterByMonth(obj));
    });
  });
}

function toFilterByMonth(APIData) {

  console.log(APIData);

}


// https://api.addthis.com/analytics/1.0/pub/<metric>[/<dimension>].<format>[?<params>]
// Metrics: shares, clicks, subscriptions, sharers, influencers, clickers, users
// dimension: day
// format .json
// params: ?period=month&pubid=


//


// https://api.addthis.com/analytics/1.0/pub/<metric>[/<dimension>].<format>[?<params>]

//todo need to pass pubid if more than one profile how to get that from API?

//

var creds = { username: process.env.BYGGAUTE_USER, password: process.env.BYGGAUTE_PW };
runApi(creds, 1495356124);

module.exports = function () {
  // documentaion: http://www.addthis.com/academy/addthis-analytics-api/
  // Fill in the username and password variables to make it work.

  return new Promise(function (resolve) {

    var username = 'byggaute@gmail.com';
    var password = 'byggautenu';
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
            },
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
