var Report = require('./../../../model/schemas/Report');
var getDataFor = require('./../../../server/databaseOperations/ApiData/getDataFor');
var currentMonthAndYear = require('./../../helpers/currentMonthAndYear');
var getLastDayOfMonth = require('./../../helpers/getLastDayOfMonth');
var startDate;
var endDate;

/**
 * Hämtar rapport och apidata (baserat månad & år samt användarid)
 * Om nuvarande månad - hämta direkt från apier
 * @param profileId
 * @param month
 * @param year
 */
function getReportByMonthAnYear(profileId, month, year) {
  if (currentMonthAndYear(month, year)) {
    startDate = new Date(year, month, 1, 0, 0, 0, 1);
    endDate = new Date();
    //  TODO: Hämta från apier
  } else {
    startDate = new Date(year, month, 1, 0, 0, 0, 1);
    endDate = new Date(year, month, getLastDayOfMonth(year, month), 23, 59, 59, 999);

    Report.findOne({
      user: profileId,
      startDate: startDate,
      endDate: endDate
    }).then(function (report) {
      var data = getDataFor(report._id);
      return { report: report, data: data };
    }).catch(function (error) {
      throw error;
    });
  }
}

module.exports = getReportByMonthAnYear;
