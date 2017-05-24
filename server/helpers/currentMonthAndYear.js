var currentMonth;
var currentYear;

//  Om nuvarande månad efterfrågas returneras true
function currentMonthAndYear(month, year) {
  currentMonth = new Date().getMonth().toString();
  currentYear = new Date().getFullYear().toString();

  return (currentYear === year) && (currentMonth === month);
}

module.exports = currentMonthAndYear;
