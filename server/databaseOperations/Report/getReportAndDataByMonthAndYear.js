var mongoose = require('mongoose');
var getCurrentApiData = require('./../ApiData/getCurrentApiData');
var getReport = require('./../Report/getReport');
var currentMonthAndYear = require('../../helpers/currentMonthAndYear');
var months = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
  'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'
];
var promises = [];
var viewObj = {};
var startDate;
var previousDate;
var previousPreviousDate;

/**
 * Hämtar rapport och apidata (baserat månad & år samt användarid)
 * Om nuvarande månad - hämta direkt från apier
 * @param profileId
 * @param month
 * @param year
 */
function getReportByMonthAnYear(user, query, month, year) {

  startDate = new Date(year, month, 1, 0, 0, 0, 1);

  switch (startDate) {
    case 0:
      //  december och november
      previousDate = new Date((year - 1), 11, 1, 0, 0, 0, 1);
      previousPreviousDate = new Date((year - 1), 10, 1, 0, 0, 0, 1);
      break;
    case 1:
      //  januari och december
      previousDate = new Date(year, (month - 1), 1, 0, 0, 0, 1);
      previousPreviousDate = new Date((year - 1), 11, 1, 0, 0, 0, 1);
      break;
    default:
      previousDate = new Date(year, (month - 1), 1, 0, 0, 0, 1);
      previousPreviousDate = new Date(year, (month - 2), 1, 0, 0, 0, 1);
  }

  console.log(startDate);
  console.log(previousDate);
  console.log(previousPreviousDate);

  viewObj = {
    user: user,
    customer: query.customer,
    queries: query,
    month: months[month],
    year: year,
    form: {}
  };

  /** IF - Om nuvarande månads data efterfrågas så hämtas data inte från databasen utan direkt
   * från apier + två föregånde månader
   * form: { data: [ [Object], [Object], [Object] ], report: [ 'n/a', [Object], [Object] ] } }
   * ELSE - vid tidigare månader hämtas data från databas
   * form: { data: [ [Object], [Object], [Object] ], report: [ [Object], [Object], [Object] ] } }
   * **/
  if (currentMonthAndYear(month, year)) {
    return new Promise(function (resolve, reject) {
      return getCurrentApiData(user.id, startDate).then(function(r1) {
        return getReport(user.id, previousDate).then(function(r2) {
          return getReport(user.id, previousPreviousDate).then(function(r3) {
            viewObj.form.data = [r1.data, r2.data, r3.data];
            viewObj.form.report = [r1.report, r2.report, r3.report];
            resolve(viewObj);
          });
        });
      }).catch(function(err) { reject(err); });
    });
  } else {
    return new Promise(function (resolve, reject) {
      return getReport(user.id, startDate).then(function(r1) {
        return getReport(user.id, previousDate).then(function(r2) {
          return getReport(user.id, previousPreviousDate).then(function(r3) {
            viewObj.form.data = [r1.data, r2.data, r3.data];
            viewObj.form.report = [r1.report, r2.report, r3.report];
            resolve(viewObj);
          });
        });
      }).catch(function(err) { reject(err) });
    });
  }
}

module.exports = getReportByMonthAnYear;
