var Report = require('../schemas/Report');
var moreThan;
var lessThan;

function checkIfFileExists(userId, startDate) {
  moreThan = new Date(startDate).toISOString();
  lessThan = new Date(startDate.setDate(startDate.getDate() + 3)).toISOString();

  return new Promise(function (resolve, reject) {
    return Report.findOne({
      user: userId,
      startDate: { $gt: moreThan, $lt: lessThan },
    }).then(function (report) {
      if (report === null) {
        resolve(false);
      } else {
        resolve(true);
      }
    }).catch(function (err) { reject(err); });
  });
}

module.exports = checkIfFileExists;
