var mongoose = require('mongoose');

var ApiData = require('./../../../model/schemas/ApiData');
var newData;

mongoose.Promise = global.Promise;

function getDataFor(report) {
  //  todo month and year are coming directly from querystring so these should be typechecked...

  newData = new ApiData({
  });

  newData.save();
  console.log('ApiData created!');
  return newData;
}

module.exports = getDataFor;