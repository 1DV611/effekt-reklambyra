var Report = require('./../schemas/Report');
var updateObj;

function updateReport(userProfileId, month, year, summary, optimization, recommendation) {
  var startDate = new Date(year, month, 1, 0, 0, 0, 1);

  // Tidszonsanpassningar
  var moreThan = new Date(startDate.setDate(startDate.getDate() - 1));
  var lessThan = new Date(startDate.setDate(startDate.getDate() + 2));

  updateObj = {
    summary: summary, // string
    optimization: optimization, // string
    recommendation: recommendation // string
  };
  return new Promise(function(resolve, reject) {
    Report.findOneAndUpdate(
      {
        user: userProfileId,
        startDate: { $gt: moreThan, $lt: lessThan }
      },
      updateObj,
      { new: true },
      function (error, matchingReport) {
        if (error) reject('updateReport(): ' + error);
        if (matchingReport === null) reject('updateReport(): No report found with userProfileId ' + userProfileId + ' and startDate ' + startDate + '.');
        resolve(matchingReport);
      }
    );
  });
}

module.exports = updateReport;
