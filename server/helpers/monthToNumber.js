function monthToNumber(target) {
  var months = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
    'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'];
  if (months.indexOf(target) === -1) {
    // throw Error
  } else {
    return months.indexOf(target);
  }
}

module.exports = monthToNumber;
