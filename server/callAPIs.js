'use strict';
var googleAPI = require('./APIs/googleAPI');
var instagramAPI = require('./APIs/instagramAPI');
var linkedinAPI = require('./APIs/linkedinAPI');
var twitterAPI = require('./APIs/twitterAPI');
var facebookAPI = require('./APIs/facebookAPI');
var accrossAPI = require('./APIs/33acrossAPI');
var addThisAPI = require('./APIs/addThisAPI');
var APIResultsToObject = require('./../server/helpers/APIResultsToObject');

/**
 *
 * @param access ett access objekt från databasen inheållandes profiler från google facebook etc incl accessTokens
 * @param startDate unix epoch timestamp, används endast för att utläsa månad och år som man vill ha data för.
 *
 * Hämtar data från alla de APIer en avändare har credentials för.
 * För att hantera async använder funktioen Promises istället för callbacks:
 * https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
 *
 * För att Promise.all ska exekvera .then måste alla Promises resolve(). Iaf ett callar reject() så
 * kommer APIResultsToObject aldrig att callas. Därför så använder ingen av API modulerna Reject() mot
 * denna funktion utan även (förväntade) errors skickas med Resolve().
 *
 * Skulle något API skicka ett oväntat error hamnar det i catch och ingen data sparas/returneras.
 *
 */

var callAPIsWith = function (access, startDate) {

  return new Promise(function (resolve, reject) {

    var promises = [];

    if (access.hasOwnProperty('twitter')) promises.push(twitterAPI(access.twitter, startDate));

    if (access.facebook) promises.push(facebookAPI(access.facebook, startDate));

    if (access.linkedin) promises.push(linkedinAPI(access.linkedin, startDate));

    if (access.google) promises.push(googleAPI(access.google.accessToken, startDate));

    if (access.instagram) promises.push(instagramAPI(access.instagram, startDate));

    //todo förvirrande namngivning tynt vs accross
    if (access.tynt) promises.push(accrossAPI(access.tynt, startDate));

    if (access.addthis) promises.push(addThisAPI(access.addthis, startDate));

    Promise.all(promises).then(function (apiData) {

      /**
       * @apiData array of returnObj
       * Alla API moduler följer samma return pattern. Ett returnObj inehåller en nyckel med apiets namn
       * och därefter ett nästlat objekt med key.value för data.
       * Varje det av ett returnObj kan ersättas med en error key iaf en viss del av data ej är möjlig att hämta
       *
       * t ex linkedin skulle kunna ge;
       *
       * linkedin {
       * newCount: 42,
       * totalCount: 42,
       * error: 'no interactions data for 2017/04'
       * }
       *
       *
       */

      resolve(APIResultsToObject(apiData));
    }).catch(function (error) {
      reject(error);
    });
  });
};

module.exports = callAPIsWith;
