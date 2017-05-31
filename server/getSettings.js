var getUserAccess = require('./databaseOperations/ApiAccess/getUserAccess.js');
var apiAccessIntersection = require('./helpers/apiAccessIntersection.js');

var apiAccessKeys;
var medias;
var allMediaNames = [
  'addthis',
  'facebook',
  'google',
  'instagram',
  'linkedin',
  'moz',
  'tynt',
  'twitter'
];

/*
 * Hämta all data från APIAccesses och
 * bygg ett objekt för Settings-vyn
 */
function getSettings(req, res) {
  getUserAccess(req.session.authZeroUserID)
    .then(function (apiAccess) {
      apiAccessKeys = Object.keys(apiAccess._doc);

      medias = allMediaNames.map(function (mediaName) {
        return {
          name: mediaName,
          isActive: apiAccessIntersection(allMediaNames, apiAccessKeys).includes(mediaName)
        };
      });

      res.render('settings', { user: req.user, medias: medias });
    });
}

module.exports = getSettings;
