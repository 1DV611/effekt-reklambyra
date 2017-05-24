var getUnixTime = function (date) {
  console.log('date', date);
  return Math.floor(date.getTime() / 1000);
};

module.exports = getUnixTime;
