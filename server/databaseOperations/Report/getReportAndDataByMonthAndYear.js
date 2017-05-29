var mongoose = require('mongoose');
var getCurrentApiData = require('./../ApiData/getCurrentApiData');
var getReport = require('./../Report/getReport');
var currentMonthAndYear = require('../../helpers/currentMonthAndYear');
var viewObj;
var startDate;
var previousDate;
var previousPreviousDate;
var months = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
  'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'
];
var promises = [];


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

      promises.push(getCurrentApiData(user.id, startDate));
      promises.push(getReport(user.id, previousDate));
      promises.push(getReport(user.id, previousPreviousDate));

      Promise.all(promises).then(function (data) {

        viewObj.form.data = [];
        viewObj.form.report = [];

        data.forEach(function (month) {
          viewObj.form.data.push(month.data);
          viewObj.form.report.push(month.report);
        });
        resolve(viewObj);
      }).catch(function (error) {
        resolve(error);
      });
    });

  } else {

    return new Promise(function (resolve, reject) {

      promises.push(getReport(user.id, startDate));
      promises.push(getReport(user.id, previousDate));
      promises.push(getReport(user.id, previousPreviousDate));

      Promise.all(promises).then(function (data) {
        viewObj.form.data = [];
        viewObj.form.report = [];

        data.forEach(function (month) {
          viewObj.form.data.push(month.data);
          viewObj.form.report.push(month.report);
        });

        resolve(viewObj);
      }).catch(function (error) {
        resolve(error);
      });
    });

  }
}

module.exports = getReportByMonthAnYear;
