var mongoose = require('mongoose');
var ApiData = require('../schemas/ApiData');

function getDataFor(report) {
  return new Promise(function(resolve, reject) {
    if (!report._id) {
        reject("getDataFor(): report has no _id property");
    }
    return ApiData.findOne({ report: report._id })
      .then(function (data) {
        if (!data) {
            reject('getDataFor(): No report found with id ' + report._id);
        }
        resolve(data);
      }).catch(function(err) { reject(err); });
  });
}

module.exports = getDataFor;
