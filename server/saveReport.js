var updateReport = require('./databaseOperations/Report/updateReport.js');
var monthToNumber = require('./helpers/monthToNumber.js');

function saveReport(req, res, next) {
  var id = req.user.id;
  var month = monthToNumber(req.body.month);
  var year = req.body.year;
  var summary = req.body.summary;
  var optimization = req.body.optimization;
  var recommendation = req.body.recommendation;
  return updateReport(id, month, year, summary, optimization, recommendation);
}

module.exports = saveReport;
