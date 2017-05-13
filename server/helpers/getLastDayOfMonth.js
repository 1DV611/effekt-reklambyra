function getLastDayOfMonth(year, month) {
  var lastDay = new Date(year, month + 1, 0);
  return lastDay.getDate();
}

module.exports = getLastDayOfMonth;
