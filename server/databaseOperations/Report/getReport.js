var getDataFor = require('./../ApiData/getDataFor');
var Report = require('../schemas/Report');
var moreThan;
var lessThan;
var reportData;
var obj;

/**
 * Hämtar Report och matchande data
 */
function getReport(userId, startDate) {
  moreThan = new Date(startDate.setDate(startDate.getDate() - 1));
  lessThan = new Date(startDate.setDate(startDate.getDate() + 2));

  return Report.findOne({
    user: userId,
    startDate: { $gt: moreThan, $lt: lessThan }
  }).then(function (report) {
    if (report === null) console.log('No such report!"');
    reportData = report;
    return report;
  }).then(function (report) {
    return getDataFor(report);
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
