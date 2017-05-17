var callAPIs = require('./../../../model/callAPIs');
var ApiAccess = require('./../../../model/schemas/ApiAccess');
var ApiData = require('./../../../model/schemas/ApiData');
var newApiData;

/**
 * Skapar ApiData efter att Report skapas, ApiData refererar till Report
 * callAPIsWith hämtar data till CreateApiData
 */
function createApiData(report) {

  ApiAccess.findOne({ user: report.user })
    .then(function (access) {
      //  return callAPIs.callAPIsWith(access);
      //  TODO: Reset after callAPIsWith is fixed
    }).then(function (data) {
      newApiData = new ApiData({
        report: report._id,
        data: data
      });

      newApiData.save(function (error) {
        if (error) throw error;
      });

      return newApiData;
    }).catch(function (error) {
      throw error;

    });
}

module.exports = createApiData;
