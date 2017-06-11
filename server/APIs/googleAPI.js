var google = require('googleapis');
var dotenv = require('dotenv');

//  OBS! you need to enable each API you want to use at console.developers.google.com/apis
var youtubeAnalytics = google.youtubeAnalytics('v1');
var analytics = google.analytics('v3');
var dateHelper = require('../helpers/epochToDate');
var ApiAccess = require('../databaseOperations/schemas/ApiAccess');
var encrypt = require('../helpers/encrypt');
var decrypt = require('../helpers/decrypt');

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

var startDateString;
var endDateString;

// you need to get the access_token from auth0IdpAccessToken.js

module.exports = function (accessObj, startDate, accessUser) {
  var relevantDate = dateHelper(startDate);

  //
  startDateString = relevantDate.year + '-' + relevantDate.addedMonthWithZeroString + '-01';

  //  TODO: Anpassa endDate för scenario nuvarande månad resp avslutad månad
  endDateString = new Date().toISOString().substring(0, 10);

  if (!accessObj.refreshToken) {
    console.error('Inget Refresh Token sparat för google profil.');
  }

  return new Promise(function (resolve) {
    oauth2Client.setCredentials({
      access_token: decrypt.decryptText(accessObj.accessToken),
      refresh_token: decrypt.decryptText(accessObj.refreshToken),
    });

    oauth2Client.refreshAccessToken(function (err, tokens) {

      if (err) {
        return console.error(err);
      }

      if (tokens) {
        ApiAccess.findOneAndUpdate(
            { user: accessUser },
            { 'google.access.accessToken': encrypt.encryptText(tokens.access_token),
              'google.access.refreshToken': encrypt.encryptText(tokens.refresh_token),
              'google.access.extraParams.id_token': encrypt.encryptText(tokens.id_token),
              'google.access.extraParams.token_type': tokens.token_type,
              'google.access.extraParams.expiry_date': tokens.expiry_date.toString(),
              'google.access.extraParams.access_token': encrypt.encryptText(tokens.access_token),
            },
            { new: true },
            function (error, matchingApiAccess) {
              if (error) {
                console.error(error);
              }

              if (matchingApiAccess === null) {
                throw new Error('No user to save token to'); // todo how to handle this?
              }
            });
      }
    });

    var result = [youtubeViews(), analyticsBaseFigures(), analyticsMostVisited(),
      analyticsTopLanding(),];
    Promise.all(result).then(function (values) {

      var returnObj = {
        youtube: values[0],
        analytics: {
          baseFigures: values[1],
          mostVisited: values[2],
          topLanding: values[3],
        },
      };

      resolve(returnObj);
    });
  }).catch(function (error) {
    console.error('google api error: ', error);
  });
};

function youtubeViews() {
  return new Promise(function (resolve) {
    var obj = {};

    // using bracket notation since google requires dashes in some of their required params
    obj['end-date'] = endDateString;
    obj['start-date'] = startDateString;
    obj['ids'] = 'channel==MINE';
    obj['metrics'] = 'views';
    obj['auth'] = oauth2Client;

    // The api explorer is very useful: https://developers.google.com/apis-explorer
    youtubeAnalytics.reports.query(obj, function (err, body) {
      if (err || !body) {
        return resolve({ error: 'youtubeViews error: ' + err.message || 'no youtube analytics for user' });
      }

      resolve({ youtube: { views: body.rows[0][0] } });
    });
  });
}

function analyticsBaseFigures() {
  return new Promise(function (resolve) {
    var obj = {};
    obj['auth'] = oauth2Client;
    analytics.management.accountSummaries.list(obj, function (err, bodyProfile) {
      if (err || !bodyProfile) {
        return resolve({ error: 'analyticsBaseFigures error: ' + err.message || 'no analytics management account for user' });
      }

      obj['end-date'] = endDateString;
      obj['start-date'] = startDateString;
      obj['ids'] = 'ga:' + bodyProfile.items[0].webProperties[0].profiles[1].id; //profiles[0] har adwords trafik enbart, profile[1] all webbplatsdata
      obj['metrics'] = 'ga:pageviews,ga:uniquePageviews,ga:avgTimeOnPage,ga:avgSessionDuration,ga:pageViewsPerSession';
      obj['auth'] = oauth2Client;
      analytics.data.ga.get(obj, function (errData, bodyData) {
        if (errData || !bodyData) {
          return resolve({ error: 'analyticsBaseFigures error: ' + errData.message || 'analytics account summary data not recieved' });
        }

        var results = bodyData.totalsForAllResults;
        var baseFigures = {
          views: results['ga:pageviews'],
          uniqueViews: results['ga:uniquePageviews'],
          strongestRedirects: '',
          mostVisitedPages: '',
          averageTime: results['ga:avgSessionDuration'],
          averageVisitedPerPages: results['ga:pageViewsPerSession'],
        };
        resolve(baseFigures);
      });
    });
  });
}

function analyticsMostVisited() {
  return new Promise(function (resolve) {
    var obj = {};
    obj['auth'] = oauth2Client;

    analytics.management.accountSummaries.list(obj, function (err, bodyProfile) {
      if (err || !bodyProfile) {
        return resolve({ error: 'analyticsMostVisited error: ' + err.message || 'no analytics most visited recieved' });
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
        if (errData || !bodyData) {
          return resolve({ error: 'analyticsMostVisited data.ga.get error: ' + errData.message || 'no analytics page views data recieved ' });
        }

        var results = bodyData.rows;
        resolve({ analyticsMostVisitedPages: results });
      });
    });
  });
}

function analyticsTopLanding() {

  return new Promise(function (resolve) {
    var obj = {};
    obj['auth'] = oauth2Client;

    analytics.management.accountSummaries.list(obj, function (err, bodyProfile) {
      if (err || !bodyProfile) {
        return resolve({ error: 'analyticsTopLanding error: ' + err.message || 'no analytics management account summary for user' });
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
        if (errData || !bodyData) {
          return resolve({ error: 'analyticsTopLending data.ga.get error: ' + errData.message || 'analytics top landing error' });
        }

        var results = bodyData.rows;
        resolve({ analyticsStrongestRedirects: results });
      });
    });
  });
}
