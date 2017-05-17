var currentMonth;
var currentYear;

//  Om nuvarande månad efterfrågas returneras true
function currentMonthAndYear(month, year) {
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();

  return currentYear === year && currentMonth === month;
}

module.exports = currentMonthAndYear;
