function intersection(mediaNamesArray, ApiAccessKeysArray) {
  return mediaNamesArray.filter(function (x) {
    return ApiAccessKeysArray.includes(x);
  });
}

module.exports = intersection;
