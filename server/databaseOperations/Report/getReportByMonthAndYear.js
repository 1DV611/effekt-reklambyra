var Report = require('./../../../model/schemas/Report');
var getDataFor = require('./../../../server/databaseOperations/ApiData/getDataFor');
var getLastDayOfMonth = require('./../../helpers/getLastDayOfMonth');

//  Get report and then apiData (by report id)
function getReportByMonthAnYear(profileId, month, year) {

  var startDate = new Date(year, month, 1, 0, 0, 0, 1);
  var endDate = new Date(year, month, getLastDayOfMonth(year, month), 23, 59, 59, 999);

  Report.findOne({
    user: profileId,
    startDate: startDate,
    endDate: endDate
  }).then(function (report) {
    var data = getDataFor(report._id);
    return { report: report, data: data };
  }).then(function (form) {
    return form;
  }).catch(function (error) {
    console.error(error);
  });

}

module.exports = getReportByMonthAnYear;
