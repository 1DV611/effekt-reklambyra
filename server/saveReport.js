var createReport = require('./databaseOperations/Report/createReport.js');
var monthToNumber = require('./helpers/monthToNumber.js');

function saveReport(req, res, next) {
  var id = req.user.id;
  var month = monthToNumber(req.body.month);
  var year = req.body.year;
  var summary = req.body.summary;
  var recommendation = req.body.recommendation;
  createReport(id, month, year, summary, recommendation);
}

module.exports = saveReport;
