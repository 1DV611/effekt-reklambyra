var Report = require('./../../../model/schemas/Report');

function getReport(profileId, reportId) {
  Report.findById({ _id: reportId },
    function (err, report) {
      if (err) console.error(err);
      if (report) console.log(report);
    });
  console.log('Report found!');
}

exports.getReport = getReport;
