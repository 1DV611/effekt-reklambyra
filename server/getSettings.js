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
  getUserAccess(req.user.id)
    .then(function (apiAccess) {

      if (Object.getOwnPropertyNames(apiAccess).length < 1) {
        apiAccessKeys = Object.keys(apiAccess._doc);
      } else {
        apiAccessKeys = [];
      }

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
