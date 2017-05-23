var Report = require('./../schemas/Report');
var newReport;

function createReport(userProfileId, month, year) {
  var startDate = new Date(year, month, 1, 0, 0, 0, 1);

  newReport = new Report({
    user: userProfileId,
    startDate: startDate
  });

  newReport.save();

  return newReport;
}

module.exports = createReport;
