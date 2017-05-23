var Report = require('../schemas/Report');

function deleteReport(reportId) {
  Report.remove({ _id: reportId },
  function (err, report) {
    if (err) console.error(err);
    if (report) console.log(report);
  });

  console.log('Report deleted!');
}

exports.deleteReport = deleteReport;
