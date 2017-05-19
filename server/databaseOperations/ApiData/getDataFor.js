var mongoose = require('mongoose');
var ApiData = require('./../../../model/schemas/ApiData');

function getDataFor(report) {
  return ApiData.findOne({ report: report._id })
    .then(function (data) {
      return data;
    }).catch(function (error) {
      console.log(error);
    });
}

module.exports = getDataFor;
