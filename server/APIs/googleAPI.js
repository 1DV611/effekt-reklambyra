var google = require('googleapis');
var dotenv = require('dotenv');
//OBS! you need to enable each API you want to use at console.developers.google.com/apis
var youtubeAnalytics = google.youtubeAnalytics('v1');
var analytics = google.analytics('v3');
var dateHelper = require('../helpers/epochToDate');

var OAuth2Client = google.auth.OAuth2;

dotenv.load();

// you can register your app and get google client id's and secret at: console.developers.google.com
var CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
var CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
var REDIRECT_URL = process.env.AUTH0_CALLBACK_URL;

// api documentation:
// http://google.github.io/google-api-nodejs-client/19.0.0/index.html
// github page:
// https://github.com/google/google-api-nodejs-client/

var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

// you need to get the access_token from auth0IdpAccessToken.js

module.exports = function (token, startDate) {
  var relevantDate = dateHelper(startDate);

  //  TODO: anpassa så att 0 läggs till på månader som inte är tvåsiffriga
  var startDateString = relevantDate.year + '-0' + relevantDate.month + '-' + '01';
  //  TODO: Anpassa endDate för scenario nuvarande månad resp avslutad månad
  var endDateString = new Date().toISOString().substring(0, 10);

  return new Promise(function (resolve, reject) {
    oauth2Client.setCredentials({
      access_token: token,
    });

    var promiseYoutube = new Promise(function (resolve, reject) {
      var obj = {};

      // using bracket notation since google requires dashes in some of their required params
      obj['end-date'] = endDateString;
      obj['start-date'] = startDateString;
      obj['ids'] = 'channel==MINE';
      obj['metrics'] = 'views';
      obj['auth'] = oauth2Client;
      // The api explorer is very useful: https://developers.google.com/apis-explorer
      youtubeAnalytics.reports.query(obj, function (err, body) {
        if (err) {
          console.error('youtube error: ', err);
        }

        //  console.log(body.rows[0][0]);
        resolve(body.rows[0][0]);
      });
    });

    var promiseAnalytics = new Promise(function (resolve, reject) {
      var obj = {};
      obj['auth'] = oauth2Client;
      analytics.management.accountSummaries.list(obj, function (err, bodyProfile) {
        if (err) {
          console.error('analytics error', err);
        }

        obj['end-date'] = endDateString;
        obj['start-date'] = startDateString;
        obj['ids'] = 'ga:' + bodyProfile.items[0].webProperties[0].profiles[1].id;
        obj['metrics'] = 'ga:pageviews,ga:uniquePageviews,ga:avgTimeOnPage,ga:avgSessionDuration,ga:pageViewsPerSession';
        obj['auth'] = oauth2Client;
        analytics.data.ga.get(obj, function (errData, bodyData) {
          if (errData) {
            reject(console.log(errData));
          }
          //console.log(bodyData);
          var results = bodyData.totalsForAllResults;
          var dataObj = {
            analyticsViews: results['ga:pageviews'],
            analyticsUniqueViews: results['ga:uniquePageviews'],
            analyticsStrongestRedirects: '',
            analyticsMostVisitedPages: '',
            analyticsAverageTime: results['ga:avgSessionDuration'],
            analyticsAverageVisitedPerPages: results['ga:pageViewsPerSession'],
          };
          resolve(dataObj);
        });
      });
    });

    var promiseAnalyticsMostVisited = new Promise(function (resolve, reject) {
      var obj = {};
      obj['auth'] = oauth2Client;
      analytics.management.accountSummaries.list(obj, function (err, bodyProfile) {
        if (err) {
          console.error('analytics most viewed error: ', err);
        }

        obj['end-date'] = endDateString;
        obj['start-date'] = startDateString;
        obj['ids'] = 'ga:' + bodyProfile.items[0].webProperties[0].profiles[1].id;
        obj['dimensions'] = 'ga:pageTitle,ga:pagePath';
        obj['metrics'] = 'ga:pageviews';
        obj['sort'] = '-ga:pageviews';
        obj['max-results'] = 4;
        obj['auth'] = oauth2Client;
        analytics.data.ga.get(obj, function (errData, bodyData) {
          if (errData) {
            reject(console.log(errData));
          }
          //console.log(bodyData.rows);
          var results = bodyData.rows;
          var dataObj = {
            analyticsMostVisitedPages: results,
          };
          resolve(dataObj);
        });
      });
    });

    var promiseAnalyticsTopLanding = new Promise(function (resolve, reject) {
      var obj = {};
      obj['auth'] = oauth2Client;
      analytics.management.accountSummaries.list(obj, function (err, bodyProfile) {
        if (err) {
          console.error('analytics top landing error: ', err);
        }

        obj['end-date'] = endDateString;
        obj['start-date'] = startDateString;
        obj['ids'] = 'ga:' + bodyProfile.items[0].webProperties[0].profiles[1].id;
        obj['dimensions'] = 'ga:landingPagePath';
        obj['metrics'] = 'ga:entrances,ga:bounces';
        obj['sort'] = '-ga:entrances';
        obj['max-results'] = 4;
        obj['auth'] = oauth2Client;
        analytics.data.ga.get(obj, function (errData, bodyData) {
          if (errData) {
            reject(console.log(errData));
          }
          //console.log(bodyData.rows);
          var results = bodyData.rows;
          var dataObj = {
            analyticsStrongestRedirects: results,
          };
          resolve(dataObj);
        });
      });
    });

    Promise.all([promiseYoutube, promiseAnalytics, promiseAnalyticsMostVisited, promiseAnalyticsTopLanding]).then(function (values) {

      var returnObj = {
          youtube: {
            views: { result: values[0], description: ' visningar.' }
          },
          analytics: {
            analyticsViews: { result: values[1].analyticsViews, description: ' visningar.' },
            analyticsUniqueViews: { result: values[1].analyticsUniqueViews, description: ' unika visningar.' },
            analyticsStrongestRedirects: { result: values[3].analyticsStrongestRedirects, description: ' är de starkaste ingångskanalerna.' },
            analyticsMostVisitedPages: { result: values[2].analyticsMostVisitedPages, description: ' är de mest besökta sidorna.' },
            analyticsAverageTime: { result: values[1].analyticsAverageTime, description: ' genomsnittlig tid på sidan.' },
            analyticsAverageVisitedPerPages: { result: values[1].analyticsAverageVisitedPerPages, description: ' genomsnittligt antal besökta sidor.' }
          }
      };
      resolve(returnObj);
    });

  }).catch(function (error) {
    console.error('google api error: ', error);
    reject(error);
  });
};
