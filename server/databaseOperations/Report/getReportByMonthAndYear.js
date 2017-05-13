var Report = require('./../../../model/schemas/Report');
var ApiData = require('./../../../model/schemas/ApiData');

//  Get report and then apiData (by report id)
function getReportByMonthAnYear(profileId, month, year) {
  Report.find({ user: profileId },
    function (err, report) {
      console.log(profileId + ' ' + month + ' ' + year);
      if (err) console.error(err);
      if (report) console.log(report);

      //  ApiData

    });
  console.log('Report found!');
}

exports.getReport = getReportByMonthAnYear;
