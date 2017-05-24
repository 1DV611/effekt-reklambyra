var mongoose = require('mongoose');
var Report = require('./../schemas/Report');
var getCurrentApiData = require('./../ApiData/getCurrentApiData');
var getDataFor = require('./../ApiData/getDataFor');
var currentMonthAndYear = require('../../helpers/currentMonthAndYear');
var viewObj;
var startDate;
var reportData;
var months = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
  'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'
];

/**
 * Hämtar rapport och apidata (baserat månad & år samt användarid)
 * Om nuvarande månad - hämta direkt från apier
 * @param profileId
 * @param month
 * @param year
 */
function getReportByMonthAnYear(req, res) {

  startDate = new Date(req.params.year, req.params.month, 1, 0, 0, 0, 1);
  viewObj = {
    user: req.user,
    customer: req.query.customer,
    queries: req.query,
    month: months[req.params.month],
    year: req.params.year,
    form: {}
  };

  /** IF - Om nuvarande månads data efterfrågas så hämtas data inte från databasen utan direkt
   * från apier
   * ELSE - vid tidigare månader hämtas data från databas
   * **/
  if (currentMonthAndYear(req.params.month, req.params.year)) {
    getCurrentApiData(req.user.id, startDate)
      .then(function (apiData) {
        viewObj.form.data = apiData;
        viewObj.form.report = 'n/a';
        console.log(viewObj);
        res.render('preview', viewObj);
      }).catch(function (err) {
        console.error(err);
      });
  } else {
    Report.findOne({
      user: req.user.id,
      startDate: startDate
    }).then(function (report) {
      if (report === null) throw new Error('No such report!"');
      reportData = report;
    }).then(function () {
      return getDataFor(reportData);
    }).then(function (apiData) {
      viewObj.form.data = apiData;
      viewObj.form.report = 'n/a';

      req.app.locals.report = viewObj;

      res.render('preview', viewObj);
    }).catch(function (err) {
      console.error(err);
    });
  }
}

module.exports = getReportByMonthAnYear;
