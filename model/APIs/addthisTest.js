'use strict';

var request = require('request');
var dateHelper = require('../../server/helpers/epochToDate');
var relevantDate;

// https://api.addthis.com/analytics/1.0/pub/<metric>[/<dimension>].<format>[?<params>]
// Metrics: shares, clicks, subscriptions, sharers, influencers, clickers, users
// dimension: day
// format .json
// params: ?period=month&pubid=
var endpoints = ['/shares/day.json?period=month&pubid=',
  '/clicks/day.json?period=month&pubid=',
 // '/subscriptions/day.json?period=month&pubid=', ger en tom array
  '/sharers/day.json?period=month&pubid=',
 // '/influencers/day.json?period=month&pubid=', ger en tom array
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
      var returnObj = {
        addThis: result,
      };

      console.log(result);
      resolve(returnObj);
    })

  });
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
  var desiredMonthString = '0' + relevantDate.addedMonth;
  var desiredYearString = relevantDate.year.toString();
  var desiredYearMonth = desiredYearString.slice(2) + desiredMonthString;

  var result = {

  };

  APIData.forEach(function (day) {
    var dataYearMonth = day.date.slice(0,4);

    if (dataYearMonth === desiredYearMonth) {

      for (var property in day) {
        if (property !== 'date' && day.hasOwnProperty(property)) {
           result[property] ? result[property] += day[property] : result[property] = day[property];
        };
      }

    }

  });

  console.log(result);
  return result;


//sharers, clickers, users, shares, clicks,


}

//todo need to pass pubid if more than one profile how to get that from API?

var creds = { username: process.env.BYGGAUTE_USER, password: process.env.BYGGAUTE_PW };
runApi(creds, 1495356124);
