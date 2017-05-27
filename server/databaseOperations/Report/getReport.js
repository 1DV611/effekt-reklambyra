var getDataFor = require('./../ApiData/getDataFor');
var Report = require('../schemas/Report');
var reportData;
var obj;

/**
 * Hämtar Report och matchande data
 */
function getReport(userId, startDate) {
  return Report.findOne({
    user: userId,
    startDate: startDate
  }).then(function (report) {
    if (report === null) console.log('No such report!"');
    reportData = report;
  }).then(function () {
    return getDataFor(reportData);
  }).then(function (apiData) {
    obj = {};

    obj.data = apiData;
    obj.report = reportData;
    return obj;
  })
    .catch(function (error) {
      console.log(error);
    });
}

//  TODO: Data not gotten from existing lars reports http://localhost:3000/user/report/2/2016

module.exports = getReport;
