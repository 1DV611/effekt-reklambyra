var Report = require('./../schemas/Report');
var updateObj;

function updateReport(userProfileId, month, year, summary, optimization, recommendation) {
  var startDate = new Date(year, month, 1, 0, 0, 0, 1);

  updateObj = {
    summary: summary, // string
    optimization: optimization, // string
    recommendation: recommendation // string
  };

  Report.findOneAndUpdate(
    { user: userProfileId,
      startDate: startDate
    },
    updateObj,
    { new: true },
    function (error, matchingReport) {
      if (error) console.log(error);
      if (matchingReport === null) throw new Error('No such report!'); //todo how to handle this?
    });

}

module.exports = updateReport;
