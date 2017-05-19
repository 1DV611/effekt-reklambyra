var getAPIAccesses = require('./databaseOperations/ApiAccess/getAPIAccesses.js');

/*
 * Hämta all data från APIAccesses och
 * bygg ett objekt för Settings-vyn
 */

function getSettings(req, res) {
  getAPIAccesses().then(function(allFromAPIAccesses) {
    var targetId = req.user.id;
    var dbObject = allFromAPIAccesses.find(function(element) {
      return element._id === targetId;
    });
    var dbKeys;
    var medias;
    var allMediaNames = [
      "addthis",
      "facebook",
      "google",
      "instagram",
      "linkedin",
      "moz",
      "tynt",
      "twitter"
    ];
    function intersection(xs, ys) {
      return xs.filter(function(x) {
        return ys.includes(x);
      });
    }
    if (dbObject === undefined) {
      //throw new Error("No user with id " + targetId + " found in APIAccesses.");
      dbObject = { twitter: "data", instagram: "data" };
    }
    dbKeys = Object.keys(dbObject);
    medias = allMediaNames.map(function(mediaName) {
      return {
        name: mediaName,
        isActive: intersection(allMediaNames, dbKeys).includes(mediaName)
      };
    });
    res.render('settings', { user: req.user, medias: medias });
    });
}

module.exports = getSettings;
