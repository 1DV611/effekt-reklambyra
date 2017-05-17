var Report = require('./../../../model/schemas/Report');
var getLastDayOfMonth = require('./../../helpers/getLastDayOfMonth');

//  Todo: finn även user-objekt för varje rapport så att företagsnamnet kan visas intill rapportlänk
/**
 * Returnerar alla rapporter samtliga användare under angiven månad och år
 * så att lista med länkar kan skapas.
 * @param month
 * @param year
 */
function getAllReportsByMonthAnYear(month, year) {
  var startDate = new Date(year, month, 1, 0, 0, 0, 1);
  var endDate = new Date(year, month, getLastDayOfMonth(year, month), 23, 59, 59, 999);

  Report.find({
    startDate: startDate,
    endDate: endDate
  }).then(function (reports) {
    return reports;
  }).catch(function (error) {
    throw error;
  });
}

module.exports = getAllReportsByMonthAnYear;
