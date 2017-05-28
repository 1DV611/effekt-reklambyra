var callAPIsWith = require('../../callAPIs');
var ApiAccess = require('../schemas/ApiAccess');
var obj;

/**
 * Hämtar ApiData direkt från diverse apier
 */
function getCurrentApiData(user, startDate) {
  return ApiAccess.findOne({ user: user })
    .then(function (access) {
      return callAPIsWith(access, startDate)
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