var getUnixTime = function (date) {
  return Math.floor(date.getTime() / 1000);
};

module.exports = getUnixTime;
