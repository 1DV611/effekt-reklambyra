var ApiData = require('./../../../model/schemas/ApiData');
var ApiAccess = require('./../../../model/schemas/ApiAccess');
var callAPIsWith = require('./../../../model/callAPIs');

function createApiData(report) {
  ApiAccess.find({ user: report.user })
    .then(function (access) {
      return callAPIsWith.callAPIsWith(access);
    })
    .then(function (data) {
      console.log('Report id from createApiData: ' + report._id);

      var newApiData = new ApiData({
        report: report._id,
        data: data
      });

      newApiData.save();
    }).catch(function (error) {
      console.log(error);
    });

};

module.exports = createApiData;
