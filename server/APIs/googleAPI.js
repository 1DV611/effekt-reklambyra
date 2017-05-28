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

var startDateString;
var endDateString;

// you need to get the access_token from auth0IdpAccessToken.js

module.exports = function (accessObj, startDate) {

  var relevantDate = dateHelper(startDate);
  //  TODO: anpassa så att 0 läggs till på månader som inte är tvåsiffriga
  startDateString = relevantDate.year + '-0' + relevantDate.month + '-' + '01';
  //  TODO: Anpassa endDate för scenario nuvarande månad resp avslutad månad
  endDateString = new Date().toISOString().substring(0, 10);

  return new Promise(function (resolve) {
    oauth2Client.setCredentials({
      access_token: accessObj.accessToken,
      refresh_token: accessObj.refreshToken,
    });

    oauth2Client.refreshAccessToken(function (err, tokens) {
      console.error(err);
      console.log(tokens);
      //todo här får man ett objekt med helt nya google credntials, access_token, expiry_date, id_token, refresh_token och token_type
      // dessa ska sparas i db för relevant user. Därför kanske hela access objektet behövs skickas med så en referns till _id finns, så att
      // vi sedan kan uppdatera rätt accessObjekt i databasen?
    });

    var result = [youtubeViews(), analyticsBaseFigures(), analyticsMostVisited(), analyticsTopLanding()];
    Promise.all(result).then(function (values) {

      console.log(values);

      var returnObj = {
        youtube: values[0],
        analytics: {
          baseFigures: values[1],
          mostVisited: values[2],
          topLanding:  values[3]
        }
      };

      //todo Gamla return objekt såg ut såhär. kan vi ta  bort den här kommentaren?
      // var returnObj = {
      //   youtube: {
      //     views: {result: values[0], description: ' visningar.'},
      //   },
      //   analytics: {
      //     analyticsViews: {result: values[1].analyticsViews, description: ' visningar.'},
      //     analyticsUniqueViews: {
      //       result: values[1].analyticsUniqueViews,
      //       description: ' unika visningar.'
      //     },
      //     analyticsStrongestRedirects: {
      //       result: values[3].analyticsStrongestRedirects,
      //       description: ' är de starkaste ingångskanalerna.'
      //     },
      //     analyticsMostVisitedPages: {
      //       result: values[2].analyticsMostVisitedPages,
      //       description: ' är de mest besökta sidorna.'
      //     },
      //     analyticsAverageTime: {
      //       result: values[1].analyticsAverageTime,
      //       description: ' genomsnittlig tid på sidan.'
      //     },
      //     analyticsAverageVisitedPerPages: {
      //       result: values[1].analyticsAverageVisitedPerPages,
      //       description: ' genomsnittligt antal besökta sidor.'
      //     },
      //   },
      // };
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
      if (err || !body) return resolve({error: err.message || 'no youtube analytics for user'});

      resolve({ youtube: { views: body.rows[0][0] } });
    });
  });
}

function analyticsBaseFigures() {

  return new Promise(function (resolve) {
    var obj = {};
    obj['auth'] = oauth2Client;
    analytics.management.accountSummaries.list(obj, function (err, bodyProfile) {
      if (err || !bodyProfile) return resolve({error: err.message || 'no analytics management account for user'});

      obj['end-date'] = endDateString;
      obj['start-date'] = startDateString;
      obj['ids'] = 'ga:' + bodyProfile.items[0].webProperties[0].profiles[1].id;
      obj['metrics'] = 'ga:pageviews,ga:uniquePageviews,ga:avgTimeOnPage,ga:avgSessionDuration,ga:pageViewsPerSession';
      obj['auth'] = oauth2Client;
      analytics.data.ga.get(obj, function (errData, bodyData) {
        if (errData || !bodyData) return resolve({ error: errData.message || 'analytics account summary data not recieved' });

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
      if (err || !bodyProfile) return resolve({ error: err.message || 'no analytics most visited recieved'});

      obj['end-date'] = endDateString;
      obj['start-date'] = startDateString;
      obj['ids'] = 'ga:' + bodyProfile.items[0].webProperties[0].profiles[1].id;
      obj['dimensions'] = 'ga:pageTitle,ga:pagePath';
      obj['metrics'] = 'ga:pageviews';
      obj['sort'] = '-ga:pageviews';
      obj['max-results'] = 4;
      obj['auth'] = oauth2Client;
      analytics.data.ga.get(obj, function (errData, bodyData) {
        if (errData || !bodyData) return resolve({ error: errData.message || 'no analytics page views data recieved '});

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
      if (err || !bodyProfile) return resolve({ error: err.message || 'no analytics management account summary for user' });

      obj['end-date'] = endDateString;
      obj['start-date'] = startDateString;
      obj['ids'] = 'ga:' + bodyProfile.items[0].webProperties[0].profiles[1].id;
      obj['dimensions'] = 'ga:landingPagePath';
      obj['metrics'] = 'ga:entrances,ga:bounces';
      obj['sort'] = '-ga:entrances';
      obj['max-results'] = 4;
      obj['auth'] = oauth2Client;

      analytics.data.ga.get(obj, function (errData, bodyData) {
        if (errData || !bodyData) return resolve({ error: errData.message || 'analytics top landing error' });

        var results = bodyData.rows;
        resolve({ analyticsStrongestRedirects: results });
      });
    });
  });
}
