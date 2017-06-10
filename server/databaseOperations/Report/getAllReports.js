var Report = require('./../schemas/Report');
var userReports;

/**
 * Returnerar alla rapporter
 * @param profileId
 * @param fullYear
 */
function getAllReports(profileId, fullYear) {

  if (fullYear === undefined) {
    return new Promise(function (resolve, reject) {
      Report.find({
        user: profileId
      }).then(function (reports) {
        userReports = [];

        reports.forEach(function (report) {
          userReports.push({
            user: report.user,
            startDate: report.startDate
          });
        });

        resolve(userReports);
      }).catch(function (error) {
        reject(error);
      });
    });
  }

  return new Promise(function (resolve, reject) {
    var startDate = new Date(fullYear);
    var moreThan = new Date(startDate.getFullYear(), 0, 1).toISOString();
    var lessThan = new Date(startDate.getFullYear() + 1, 0, 1).toISOString();
    Report.find({
      user: profileId,
      startDate: { $gt: moreThan, $lt: lessThan }
    }).then(function (reports) {
      userReports = [];

      reports.forEach(function (report) {
        userReports.push({
          user: report.user,
          startDate: report.startDate
        });
      });

      resolve(userReports);
    }).catch(function (error) {
      reject(error);
    });
  });
}

module.exports = getAllReports;
