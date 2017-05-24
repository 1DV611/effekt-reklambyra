var createReport = require('./databaseOperations/Report/createReport.js');

function monthToNumber(target) {
  var months = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
    'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'];
  if (months.indexOf(target) === -1) {
    // throw Error
  } else {
    return months.indexOf(target);
  }
}

function saveReport(req, res, next) {
  var id = req.user.id;
  var month = monthToNumber(req.body.month);
  var year = req.body.year;
  var summary = req.body.summary;
  var recommendation = req.body.recommendation;
  createReport(id, month, year, summary, recommendation);
}

module.exports = saveReport;
