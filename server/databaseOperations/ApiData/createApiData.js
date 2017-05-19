var callAPIsWith = require('./../../../model/callAPIs');
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
      return callAPIsWith(access, report.startDate, report.endDate)
        .then(function (data) {
          return data;
        }).catch(function (error) {
          throw error;
        });
    }).then(function (data) {

      var obj = {
        report: report._id,
      };

      for (var prop in data) {
          obj[prop] = data[prop];
      }

      newApiData = new ApiData(obj);

      newApiData.save(function (error) {
        if (error) throw error;
      });

    return newApiData;

    }).catch(function (error) {
      throw error;
    });
}

module.exports = createApiData;
