'use strict';

var errorHandler = require('./errorHandler');
var getAPIAccesses = require('./databaseOperations/ApiAccess/getAPIAccesses');
var createReport = require('./databaseOperations/Report/createReport');
var createApiData = require('./databaseOperations/ApiData/createApiData');
var epochToDate = require('./helpers/epochToDate');

/**
 Takes all the api access objects from db, cycles them and calls the callAllAPIs script for all of them
 need a current date as well.
 */

function monthlyUpdate(date) {

  getAPIAccesses()
      .then(function (APIAccesses) {
        APIAccesses.forEach(function (APIAccess) {
          updateEach(APIAccess, date);
        });
      }).catch(function (error) {
        errorHandler.log(error, 'cronJob monthly');
  });

  //  Creates report + data per for each user in db based on activated providers
  // (facebook, instagram) etc

}

function dailyUpdate(date) {
  getAPIAccesses().then(function (APIAccesses) {
    APIAccesses.forEach(function (APIAccess) {
      // todo
      // inte säker på iaf det date som skickas här blir rätt, kan ev. behöva använda dateToEpoch eller dylikt
      // databasfunktion liknande createApiData som uppdaterar daglig API data genom att calla
      // callAPIs.js .daily metod
      // denna schemaläggs att köras dagligen med apiScheduler
    });
  }).catch(function (error) {
    errorHandler.log(error, 'cronJob daily');
  });
}

function updateEach(APIAccess, date) {
  var currentDate = epochToDate(date);

  createReport(APIAccess.user, currentDate.month, currentDate.year)
    .then(function (report) {
      if (report !== undefined) {
        createApiData(report);
      }
    }).catch(function (error) {
    errorHandler.log(error, 'cronJob updateEach');
    });
}

exports.monthly = monthlyUpdate;
exports.daily = dailyUpdate;
exports.updateEach = updateEach;
