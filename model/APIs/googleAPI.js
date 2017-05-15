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

var dataFromAPIObj = {
  youtube: {
    views: '',
  },
  analytics: {
    views: '',
    uniqueViews: '',
    strongestRedirects: '',
    mostVisitedPages: '',
    averageTime: '',
    averageVisitedPerPages: '',
    viewsPreviousMonth: '',
    viewsPreviousMonth2: '',
  },
};

module.exports = function (token, year, month1, previousMonth1, monthBeforePreviousMonth1) {
  var month = Number(month1) + 1;
  var nextMonth = Number(month1) + 2;
  var previousMonth = Number(previousMonth1) + 1;
  var monthBeforePreviousMonth = Number(monthBeforePreviousMonth1) + 1;
  var nextMonthYear = Number(year);
  var previousMonthYear = Number(year);
  var monthBeforePreviousMonthYear = Number(year);
  if (month >= 12) {
    nextMonthYear += 1;
    nextMonth = 1;
  } else if (month <= 1) {
    previousMonthYear -= 1;
    monthBeforePreviousMonthYear -= 1;
  } else if (month <= 2) {
    monthBeforePreviousMonthYear -= 1;
  }
  if (month < 10) {
    month = '0' + month;
  }
  if (nextMonth < 10) {
    nextMonth = '0' + nextMonth;
  }
  if (previousMonth < 10) {
    previousMonth = '0' + previousMonth;
  }
  if (monthBeforePreviousMonth < 10) {
    monthBeforePreviousMonth = '0' + monthBeforePreviousMonth;
  }
  let endDate = '' + nextMonthYear + '-' + nextMonth + '-01';
  let startDate = '' + year + '-' + month + '-01';
  let endDatePrevious = startDate;
  let startDatePrevious = '' + previousMonthYear + '-' + previousMonth + '-01';
  let endDatePrevious2 = startDatePrevious;
  let startDatePrevious2 = '' + monthBeforePreviousMonthYear + '-' + monthBeforePreviousMonth + '-01';

  return new Promise(function (resolve, reject) {
    oauth2Client.setCredentials({
      access_token: token,
    });

    var promiseYoutube = new Promise(function (resolve, reject) {
      var obj = {};
      // using bracket notation since google requires dashes in some of their required params
      obj['end-date'] = endDate;
      obj['start-date'] = startDate;
      obj['ids'] = 'channel==MINE';
      obj['metrics'] = 'views';
      obj['auth'] = oauth2Client;
      // The api explorer is very useful: https://developers.google.com/apis-explorer
      youtubeAnalytics.reports.query(obj, function (err, body) {
        if (err) {
          reject(console.log(err));
        }
        //console.log(body.rows[0][0]);
        dataFromAPIObj.youtube.views = body.rows[0][0];
        resolve(body.rows[0][0]);
      });
    });

    var promiseAnalytics = new Promise(function (resolve, reject) {
      var obj = {};
      obj['auth'] = oauth2Client;
      analytics.management.accountSummaries.list(obj, function (err, bodyProfile) {
        if (err) {
          reject(console.log(err));
        }

        obj['end-date'] = endDate;
        obj['start-date'] = startDate;
        obj['ids'] = 'ga:' + bodyProfile.items[0].webProperties[0].profiles[1].id;
        obj['metrics'] = 'ga:pageviews,ga:uniquePageviews,ga:avgTimeOnPage,ga:avgSessionDuration,ga:pageViewsPerSession';
        obj['auth'] = oauth2Client;
        analytics.data.ga.get(obj, function (errData, bodyData) {
          if (errData) {
            reject(console.log(errData));
          }
          //console.log(bodyData);
          var results = bodyData.totalsForAllResults;
          dataFromAPIObj.analytics.views = results['ga:pageviews'];
          dataFromAPIObj.analytics.uniqueViews = results['ga:uniquePageviews'];
          dataFromAPIObj.analytics.averageTime = Math.round(results['ga:avgSessionDuration'] * 10) / 10;
          dataFromAPIObj.analytics.averageVisitedPerPages = Math.round(results['ga:pageViewsPerSession'] * 10) / 10;
          resolve(dataFromAPIObj.analytics);
        });
      });
    });

    var promiseAnalyticsMostVisited = new Promise(function (resolve, reject) {
      var obj = {};
      obj['auth'] = oauth2Client;
      analytics.management.accountSummaries.list(obj, function (err, bodyProfile) {
        if (err) {
          reject(console.log(err));
        }

        obj['end-date'] = endDate;
        obj['start-date'] = startDate;
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
          dataFromAPIObj.analytics.mostVisitedPages = results;
          resolve(results);
        });
      });
    });

    var promiseAnalyticsTopLanding = new Promise(function (resolve, reject) {
      var obj = {};
      obj['auth'] = oauth2Client;
      analytics.management.accountSummaries.list(obj, function (err, bodyProfile) {
        if (err) {
          reject(console.log(err));
        }

        obj['end-date'] = endDate;
        obj['start-date'] = startDate;
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
          dataFromAPIObj.analytics.strongestRedirects = results;
          resolve(results);
        });
      });
    });

    var analyticsViewsPreviousMonth = new Promise(function (resolve, reject) {
      var obj = {};
      obj['auth'] = oauth2Client;
      analytics.management.accountSummaries.list(obj, function (err, bodyProfile) {
        if (err) {
          reject(console.log(err));
        }

        obj['end-date'] = endDatePrevious;
        obj['start-date'] = startDatePrevious;
        obj['ids'] = 'ga:' + bodyProfile.items[0].webProperties[0].profiles[1].id;
        obj['metrics'] = 'ga:pageviews,ga:uniquePageviews';
        obj['auth'] = oauth2Client;
        analytics.data.ga.get(obj, function (errData, bodyData) {
          if (errData) {
            reject(console.log(errData));
          }
          //console.log(bodyData);
          var results = bodyData.totalsForAllResults;
          dataFromAPIObj.analytics.viewsPreviousMonth = results['ga:pageviews'];
          resolve(dataFromAPIObj.analytics);
        });
      });
    });
    var analyticsViewsPreviousMonth2 = new Promise(function (resolve, reject) {
      var obj = {};
      obj['auth'] = oauth2Client;
      analytics.management.accountSummaries.list(obj, function (err, bodyProfile) {
        if (err) {
          reject(console.log(err));
        }

        obj['end-date'] = endDatePrevious2;
        obj['start-date'] = startDatePrevious2;
        obj['ids'] = 'ga:' + bodyProfile.items[0].webProperties[0].profiles[1].id;
        obj['metrics'] = 'ga:pageviews,ga:uniquePageviews';
        obj['auth'] = oauth2Client;
        analytics.data.ga.get(obj, function (errData, bodyData) {
          if (errData) {
            reject(console.log(errData));
          }
          //console.log(bodyData);
          var results = bodyData.totalsForAllResults;
          dataFromAPIObj.analytics.viewsPreviousMonth2 = results['ga:pageviews'];
          resolve(dataFromAPIObj.analytics);
        });
      });
    });

    Promise.all([promiseYoutube, promiseAnalytics, promiseAnalyticsMostVisited,
      promiseAnalyticsTopLanding, analyticsViewsPreviousMonth, analyticsViewsPreviousMonth2]).then(function (values) {
      console.log(dataFromAPIObj);
      resolve(dataFromAPIObj);
    });

  }).catch(function (error) {
    console.error(error);
    reject(error);
  });
};
