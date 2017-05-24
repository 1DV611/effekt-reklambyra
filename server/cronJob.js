'use strict';
var callAPIs = require('./callAPIs');
var getAPIAccesses = require('./databaseOperations/ApiAccess/getAPIAccesses');
var createReport = require('./databaseOperations/Report/createReport');
var createApiData= require('./databaseOperations/ApiData/createApiData');
var saveAPI = require('./databaseOperations/ApiData/saveAPI');
var dateToAdjustedEpoch = require('./helpers/adjustedEpoch');

/**
 Takes all the api access objects from db, cycles them and calls the callAllAPIs script for all of them
 need a current date as well.
 */

// todo scheduling fungerar men behöver använda nya db strukturen, dvs hämta alla användare.
module.exports = function (unixTimeStamp) {

  getAPIAccesses()
      .then(function (APIAccesses) {
        APIAccesses.forEach(function (APIAccess) {
          updateEach(APIAccess);
        });
      }).catch(function (error) {
        throw error;
      });

  var updateEach = function (APIAccess) {
    callAPIs(APIAccess, unixTimeStamp)
        .then(function (apiData) {
          /**
           * Create
           */
          saveAPI(apiData);
        }).catch(function (error) {
      console.error(error);
    });
  };
};
