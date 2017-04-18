var google = require('googleapis');
var dotenv = require('dotenv');

//OBS! you need to enable each API you want to use at console.developers.google.com/apis
var youtubeAnalytics = google.youtubeAnalytics('v1');

var OAuth2Client = google.auth.OAuth2;

dotenv.load();

// you can register your app and get google client id's and secret at: console.developers.google.com
var CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
var CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
var REDIRECT_URL = 'http://localhost:3000/callback';

// api documentation:
// http://google.github.io/google-api-nodejs-client/19.0.0/index.html
// github page:
// https://github.com/google/google-api-nodejs-client/

var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

// you need to get the access_token from auth0IdpAccessToken.js
oauth2Client.setCredentials({
  access_token: 'ya29.GlsrBOPp6MNbiGO3rrm6PJ-d-5bkxjl2S9GowirNtWTGhRt4ZxFoBDScAbdAlSF0u6P1u6kYTAE-9P9vJib7NAUGZY3tD6m6aCgG3IZkituweWKvO2zE3G9CJZj4'
});

var standardCallback = function (err, body) {
  if (err) {
    return console.log(err);
  }

  console.log(body);
};

var obj = {};

// using bracket notation since google requires dashes in some of their required params
obj['end-date'] = '2017-04-11';
obj['start-date'] = '2001-01-01';
obj['ids'] = 'channel==KnyHMv2OeQQVHEmqWRvd6w';
obj['metrics'] = 'views';
obj['auth'] = oauth2Client;

youtubeAnalytics.reports.query(obj, standardCallback);
