var Report = require('./../schemas/Report');
var dates = {};

/**
 * Returnerar object med årtals properties med värdet array med månader
 * @param userID
 */
function getMonthsAndYearsOfUserReports(userID) {
  return new Promise(function (resolve, reject) {
    Report.find({
      user: userID
    }).then(function (reports) {
      reports.forEach(function (report) {
        if (Object.prototype.hasOwnProperty.call(dates, report.startDate.getFullYear())) {
          dates[report.startDate.getFullYear()].push(report.startDate.getMonth());
        } else {
          dates[report.startDate.getFullYear()] = [report.startDate.getMonth()];
        }
      });
      resolve(dates);
    }).catch(function (err) { reject(err); });
  });
}

module.exports = getMonthsAndYearsOfUserReports;
