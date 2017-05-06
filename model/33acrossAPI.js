'use strict';
var request = require('request');
var fetchJsonp = require('fetch-jsonp');


// there's no login to get these, must be entered manually.
var secret_api_key = '6l303n3J6c3k7Q486k7R6W6G6r7P7s3V';
var site_guid = 'dQ3jXaM6qr4Pilacwqm_6l';

var api_url = 'https://api.tynt.com/publisher/v2/realtime_stats/page_copies';
var andSiteGuid = '?site_guid=';
var andApiKey = '&api_key=';
var andLimit = '&limit=';
var limit = 10;
var andCallback = '&callback=';
var callbackName = 'callbackName';
var andStartTime = '&start_time=';
var andEndTime = '&end_time=';

var queryString = api_url + andSiteGuid + site_guid + andApiKey + secret_api_key + andCallback + callbackName + andLimit + limit;

var callbackName = function (err, data) {
  console.log(err, body, smth);
};

var options = {
  param: 'callbackName',
};

fetchJsonp(queryString).then(function (response) {
  console.log('response')
});