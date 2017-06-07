var Report = require('./../schemas/Report');
var checkIfReportExists = require('./checkIfReportExists');
var newReport;

function createReport(userProfileId, month, year) {
  var startDate = new Date(year, month, 1);
  return new Promise(function (resolve, reject) {
    checkIfReportExists(userProfileId, startDate)
    .then(function (exists) {
      if (exists === false) {
        console.log('report is created');
        newReport = new Report({
          user: userProfileId,
          startDate: startDate
        });

        newReport.save();
        return newReport;
      }
    }).then(function (report) {
      resolve(report);
    }).catch(function (err) {
      reject(err);
    });
  });
}

module.exports = createReport;
