var getLastDayOfMonth = require('./../../helpers/getLastDayOfMonth');
var Report = require('./../../../model/schemas/Report');
var newReport;

function createReport(userProfileId, month, year) {
  newReport = new Report({
    user: userProfileId,
    startDate: new Date(year, month, 1, 0, 0, 0, 1),
    endDate: new Date(year, month, getLastDayOfMonth(year, month), 23, 59, 59, 999)
  });

  newReport.save();
  console.log('Report created!');
  console.log('Report id: ' + newReport._id);
  return newReport;
}

module.exports = createReport;
