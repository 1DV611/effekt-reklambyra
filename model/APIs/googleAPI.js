var google = require('googleapis');
var dotenv = require('dotenv');
//OBS! you need to enable each API you want to use at console.developers.google.com/apis
var youtubeAnalytics = google.youtubeAnalytics('v1');
var analytics = google.analytics('v3');

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

module.exports = function (token, callback) {
  oauth2Client.setCredentials({
    access_token: token,
  });

  if (!callback) {
    return;
  }
  var promiseYoutube = new Promise(function (resolve, reject) {
    var obj = {};
    // using bracket notation since google requires dashes in some of their required params
    obj['end-date'] = '2017-05-01';
    obj['start-date'] = '2001-01-01';
    obj['ids'] = 'channel==MINE';
    obj['metrics'] = 'views';
    obj['auth'] = oauth2Client;
    // The api explorer is very useful: https://developers.google.com/apis-explorer
    youtubeAnalytics.reports.query(obj, function (err, body) {
      if (err) {
        reject(console.log(err));
      }

      console.log(body.rows[0][0]);
      resolve(body.rows[0][0]);
    });
  });

  var promiseAnalytics = new Promise(function(resolve, reject) {
    var obj = {};
    obj['auth'] = oauth2Client;
    analytics.management.accountSummaries.list(obj, function (err, bodyProfile) {
      if (err) {
        reject(console.log(err));
      }

      obj['end-date'] = '2017-05-01';
      obj['start-date'] = '2005-01-01';
      obj['ids'] = 'ga:' + bodyProfile.items[0].webProperties[0].profiles[1].id;
      obj['metrics'] = 'ga:pageviews,ga:uniquePageviews,ga:avgTimeOnPage,ga:avgSessionDuration,ga:pageViewsPerSession';
      obj['auth'] = oauth2Client;
      analytics.data.ga.get(obj, function (errData, bodyData) {
        if (errData) {
          reject(console.log(errData));
        }
        console.log(bodyData);
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

  Promise.all([promiseYoutube, promiseAnalytics]).then(function (values) {
    var returnObj = {
      youtubeViews: values[0],
      analytics: values[1],
    }
    return callback(returnObj);
  });
};

function getYoutubeViews() {
  var obj = {};
  // using bracket notation since google requires dashes in some of their required params
  obj['end-date'] = '2017-05-01';
  obj['start-date'] = '2001-01-01';
  obj['ids'] = 'channel==MINE';
  obj['metrics'] = 'views';
  obj['auth'] = oauth2Client;
  // The api explorer is very useful: https://developers.google.com/apis-explorer
  youtubeAnalytics.reports.query(obj, function (err, body) {
    if (err) {
      return console.log(err);
    }

    console.log(body.rows[0][0]);
    return body.rows[0][0];
  });
}

function getAnalyticsPageViews() {
  var obj = {};
  obj['auth'] = oauth2Client;

  analytics.management.accountSummaries.list(obj, function (err, bodyProfile) {
    if (err) {
      return console.log(err);
    }
    obj['end-date'] = '2017-05-01';
    obj['start-date'] = '2005-01-01';
    obj['ids'] = 'ga:' + bodyProfile.items[0].webProperties[0].profiles[1].id;
    obj['metrics'] = 'ga:pageviews,ga:uniquePageviews,ga:avgTimeOnPage,ga:avgSessionDuration,ga:pageViewsPerSession';
    obj['auth'] = oauth2Client;
    analytics.data.ga.get(obj, function (errData, bodyData) {
      if (errData) {
        return console.log(errData);
      }
      console.log(bodyData);
      return bodyData.totalsForAllResult;
    });
  });
}
