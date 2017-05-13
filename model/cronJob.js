'use strict';
var APIs = require('./callAPIs');
var getAPIAccesses = require('./../server/databaseOperations/ApiAccess/getAPIAccesses');
var saveAPI = require('./../server/databaseOperations/ApiData/saveAPI');

// get all the users
// use a helper function to get the right stuff from each
// call the db for each user
// PROFIT

module.exports = function () {
  var updateEach = function (APIAccess) {
    APIs.callAPIsWith(APIAccess)
      .then(function (apiData) {
        saveAPI(apiData);
      }).catch(function (error) {
        console.error(error);
      });
  };

  getAPIAccesses()
    .then(function (APIAccesses) {
      console.log(APIAccesses);
      APIAccesses.forEach(function (APIAccess) {
        updateEach(APIAccess);
      });
    }).catch(function (error) {
      console.error(error);
    });
};
