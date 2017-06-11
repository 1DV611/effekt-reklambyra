var APIResultsToObject = function (results) {
  var obj = {};

  results.forEach(function (result) {
    for (var property in result) {
      obj[property] = result[property];
    }
  });

  return obj;
};

module.exports = APIResultsToObject;
