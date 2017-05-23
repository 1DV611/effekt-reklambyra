var callAPIs = require('../../callAPIs');
var ApiAccess = require('../schemas/ApiAccess');
var ApiData = require('../schemas/ApiData');
var newApiData;

function createApiData(report) {
  //  todo month and year are coming directly from querystring so these should be typechecked...
  ApiAccess.findOne({ user: report.user })
    .then(function (access) {
      console.log("access ");
      console.log(access);
      return { hej: "hej"};
      //  return callAPIs.callAPIsWith(access);
      //  TODO: Reset after callAPIsWith is fixed
    }).then(function (data) {
      console.log(data);

      newApiData = new ApiData({
        report: report._id,
        data: data
      });

      newApiData.save();
      console.log('ApiData created!');
      console.log(newApiData);
      return newApiData;
    }).catch(function (error) {
      console.error(error);
    });
}

module.exports = createApiData;
