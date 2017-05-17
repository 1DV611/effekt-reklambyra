'use strict';
var request = require('request');

module.exports = function () {

  // there's no login to get these, must be entered manually.

  return new Promise(function (resolve) {

    //todo the api key and site guid for each client must be entered in the view, hardcoding them is temp.
    var secret_api_key = '6l303n3J6c3k7Q486k7R6W6G6r7P7s3V';
    var site_guid = 'dQ3jXaM6qr4Pilacwqm_6l';

    /**
     *
     * These are the query string params that you can use to construct various querie s with the 33across API.
     * Whilst we're only making one request now, we've broken them up in this way in case you want to requiest more api data later on.
     */
    var api_url = 'https://api.tynt.com/publisher/v2/realtime_stats/page_copies';
    var andSiteGuid = '?site_guid=';
    var andApiKey = '&api_key=';
    var andLimit = '&limit=';
    var limit = 1000;
    var andCallback = '&callback=';
    var callbackName = 'callbackName';
    var andStartTime = '&start_time=';
    var start_time = 1;
    var andEndTime = '&end_time=';

    var queryString = api_url + andSiteGuid + site_guid + andApiKey + secret_api_key + andStartTime + start_time + andLimit + limit;

    request(queryString, function (err, res, body) {
      if (err) {
        resolve({});
        console.log('33accross api error: ', err);
      } else {

        try {

          var obj = JSON.parse(body);
          var totalCopiedContent = 0;
          for (var i = 0; i < obj.length; i += 1) {
            console.log(obj[i]);
            totalCopiedContent += obj[i].total;
          }

          console.log('33across result:', totalCopiedContent);
          var returnObj = {
            accross: {
              totalCopiedContent: totalCopiedContent,
            }
          };
          resolve(returnObj);

        } catch (e) {
          resolve({});
          console.error('33across api e: ', e);
        }
      }
    });
  });
};
