var Report = require('./../../../model/schemas/Report');
var newReport;

function createReport(userProfileId, year, month) {

  newReport = new Report({
    user: userProfileId,
    startDate: new Date(year, month, 1, 0, 0, 0, 1),
    endDate: new Date(year, month, getLastDayOfMonth(year, month), 23, 59, 59, 999)
  });

  newReport.save();
  console.log('Report created!');
};

exports.createReport = createReport;
