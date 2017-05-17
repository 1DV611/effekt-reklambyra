'use strict';
var APIs = require('./callAPIs');
var getAPIAccesses = require('./../server/databaseOperations/ApiAccess/getAPIAccesses');
var createReport = require('./../server/databaseOperations/Report/createReport');
var createAPIData = require('./../server/databaseOperations/ApiData/createAPIData');
var saveAPI = require('./../server/databaseOperations/ApiData/saveAPI');

/*
 Takes all the api access objects from db, cycles them and calls the callAllAPIs script for all of them
 */

module.exports = function () {

  getAPIAccesses()
      .then(function (APIAccesses) {
        APIAccesses.forEach(function (APIAccess) {
          updateEach(APIAccess);
        });
      }).catch(function (error) {
        throw error;
      });

  var updateEach = function (APIAccess) {
    APIs.callAPIsWith(APIAccess)
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
