var callAPIs = require('../../callAPIs');
var ApiAccess = require('../schemas/ApiAccess');
var obj;

/**
 * Hämtar ApiData direkt från diverse apier
 */
function getCurrentApiData(user, startDate) {
  return ApiAccess.findOne({ user: user })
    .then(function (access) {
      return callAPIs.monthly(access, startDate)
        .then(function (data) {
          obj = {};

          obj.data = data;
          obj.report = 'n/a';

          return obj;
        }).catch(function (error) {
          throw error;
        });
    }).catch(function (error) {
      throw error;
    });
}

module.exports = getCurrentApiData;