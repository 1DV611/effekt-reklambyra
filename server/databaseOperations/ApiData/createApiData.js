var callAPIs = require('../../callAPIs');
var ApiAccess = require('../schemas/ApiAccess');
var ApiData = require('../schemas/ApiData');
var dateToEpoch = require('../../helpers/dateToEpoch');
var newApiData;

/**
 * Skapar ApiData efter att Report skapas, ApiData refererar till Report
 * callAPIsWith hämtar data till CreateApiData
 */
function createApiData(report) {
  return ApiAccess.findOne({ user: report.user })
    .then(function (access) {
      console.log(report.startDate);
      return callAPIs.monthly(access, dateToEpoch(report.startDate))
        .then(function (data) {
          return data;
        }).catch(function (error) {
          console.error(error);
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
