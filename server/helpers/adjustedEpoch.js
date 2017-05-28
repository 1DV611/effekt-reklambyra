'use strict';
var dateToEpoch = require('./dateToEpoch');

/**
 * @param desiredAdjustment hur långt bakåt du vill justera tiden
 * @returns {number} unixTimstamp
 */

module.exports = function (desiredAdjustment) {
  var jsDate = new Date();
  var epoch = dateToEpoch(jsDate);
  return (epoch - desiredAdjustment);
};