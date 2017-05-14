var mongoose = require('mongoose');

var createReport = require('./../../databaseOperations/Report/createReport');
var createApiData = require('./../../databaseOperations/ApiData/createApiData');

mongoose.Promise = global.Promise;

function getDataFor(profileId, month, year) {
  //  todo month and year are coming directly from querystring so these should be typechecked...
  var newReport = createReport(profileId, month, year);
  var newApiData = createApiData(newReport);

  return { report: newReport, data: newApiData };
}

module.exports = getDataFor;
