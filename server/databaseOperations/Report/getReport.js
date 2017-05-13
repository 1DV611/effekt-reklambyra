var Report = require('./../../../model/schemas/Report');
var ApiData = require('./../../../model/schemas/ApiData');

function getReport(profileId, reportId) {
  Report.findById({ _id: reportId },
    function (err, report) {
      if (err) console.error(err);
      if (report) console.log(report);
      ApiData

    });
  console.log('Report found!');
}

exports.getReport = getReport;
