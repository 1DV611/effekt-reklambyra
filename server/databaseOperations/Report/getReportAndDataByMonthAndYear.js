var mongoose = require('mongoose');
var Report = require('./../schemas/Report');
var getDataFor = require('./../ApiData/getDataFor');
var currentMonthAndYear = require('../../helpers/currentMonthAndYear');
var getLastDayOfMonth = require('../../helpers/getLastDayOfMonth');
var startDate;
var endDate;
var reportData;
var months = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
    'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December',
];

/**
 * Hämtar rapport och apidata (baserat månad & år samt användarid)
 * Om nuvarande månad - hämta direkt från apier
 * @param profileId
 * @param month
 * @param year
 */
function getReportByMonthAnYear(req, res) {
  if (currentMonthAndYear(req.params.month, req.params.year)) {
    startDate = new Date(req.params.year, req.params.month, 1, 0, 0, 0, 1);
    endDate = new Date();
    //  TODO: Hämta från apier
  } else {
    startDate = new Date(req.params.year, req.params.month, 1, 0, 0, 0, 1);

    Report.findOne({
      user: req.user.id,
      startDate: startDate
    }).then(function (report) {
      if (report === null) throw new Error('No such report!"');
      reportData = report;
    }).then(function () {
      return getDataFor(reportData);
    }).then(function (apiData) {
      res.render('preview', { user: req.user, customer: req.query.customer, queries: req.query, month: months[req.params.month], year: req.params.year, form: { report: reportData, data: apiData } });
    }).catch(function (err) {
      console.error(err);
    });
  }
}

module.exports = getReportByMonthAnYear;
