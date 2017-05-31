'use strict';
/**
 * @param unixTimeStamp
 * @returns {{month: number, year: number}}
 * helper funktion för att samla formattering av daterange för användning när datum params ska skickas
 * till APIer.
 */
module.exports = function (unixTimeStamp) {

  if (typeof unixTimeStamp === 'string') unixTimeStamp = parseInt(unixTimeStamp);

  var date = new Date();
  // * 1000 då js använder ms
  date.setTime(unixTimeStamp * 1000);
  var month = date.getMonth();
  var addedMonth = month + 1;


  return {
    // full sparas iaf andra datum funktioner skulle behövas senare
    full: date,
    month: date.getMonth(),
    addedMonth: addedMonth,
    year: date.getFullYear(),
    monthWithZeroString: month > 9 ? month : '0' + month,
    addedMonthWithZeroString: addedMonth > 9 ? addedMonth : '0' + addedMonth
  }

};