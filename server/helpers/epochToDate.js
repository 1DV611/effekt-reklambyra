'use strict';
/**
 * @param unixTimeStamp
 * @returns {{month: number, year: number}}
 * helper funktion för att samla formattering av daterange för användning när datum params ska skickas
 * till APIer.
 */
module.exports = function (unixTimeStamp) {
  var date = new Date();
  // * 1000 då js använder ms
  date.setTime(unixTimeStamp * 1000);

  return {
    month: date.getMonth(),
    addedMonth: (date.getMonth() + 1),
    year: date.getFullYear()
  }

};