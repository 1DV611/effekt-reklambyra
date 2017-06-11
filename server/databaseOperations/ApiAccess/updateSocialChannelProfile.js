var ApiAccess = require('../schemas/ApiAccess');
var encryptSensitiveProfileProperties = require('../../helpers/encryptSensitiveProfileProperties');

var queryObj;
var updateObj;

/**
 * Sparar och uppdaterar accessinformation för sociala medier
 * vid autentisering mot exempelvis facebook/twitter m.m.
 * Om profile enbart innehåller propertyn provider tas denna propertyn bort
 * @param sessionUserID
 * @param profile
 */
function updateSocialChannelProfile(sessionUserID, profile) {
  updateObj = {
    updated: Date.now(),
  };

  //  If - Inaktiverar medier som anges i array för användaren
  //  Else - sparar och uppdaterar medier för användaren
  if (Array.isArray(profile)) {
    updateObj = {
      $unset: {},
    };

    profile.forEach(function (media) {
      updateObj.$unset[media] = 1;
    });
  } else {
    console.log(JSON.stringify(profile));

    queryObj = {
      provider: profile.provider,
      access: encryptSensitiveProfileProperties(profile),
    };

    updateObj[queryObj.provider] = queryObj;
  }

  ApiAccess.findOneAndUpdate(
    { user: sessionUserID },
    updateObj,
    { new: true },
    function (error, matchingApiAccess) {
      if (error) {
        console.log(error);
      }

      if (matchingApiAccess === null) {
        console.log('No user to save token to');
      }
    });
}

module.exports = updateSocialChannelProfile;
