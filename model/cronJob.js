'use strict';
var APIs = require('./callAPIs');
var db = require('./db');

// get all the users
// use a helper function to get the right stuff from each
// call the db for each user
// PROFIT

module.exports = function () {

  db.getAPIAccesses().then(function (APIAccesses) {
    console.log(APIAccesses);
    APIAccesses.forEach(function (APIAccess) {
      updateEach(APIAccess);
    });
  }).catch(function (error) {
    console.error(error);
  });

  var updateEach = function (APIAccess) {

    APIs.callAPIsWith(APIAccess).then(function (apiData) {
      db.saveAPI(apiData);
    }).catch(function (error) {
      console.error(error);
    });
  };
}