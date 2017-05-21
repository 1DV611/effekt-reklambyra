var ApiAccess = require('./../../../model/schemas/ApiAccess');

/**
 * Sparar eller uppdaterar accessinformation för sociala medier
 * vid autentisering mot exempelvis facebook/twitter m.m.
 * @param sessionUserID
 * @param profile
 */
function updateSocialChannelProfile(sessionUserID, profile) {
  var queryObj = {
    provider: profile.provider,
    accessToken: profile.accessToken,
    refreshToken: profile.refreshToken,
    id_token: profile.id_token,
    extraParams: profile.extraParams,
    profile: {
      _json: profile._json,
      _raw: profile._raw
    }
  };

  var updateObj = {
    updated: Date.now()
  };

  // ES5 stödjer inte computed property names därav denna ändring. Dvs {[queryObj.provider]: queryObj} fungerar inte
  updateObj[queryObj.provider] = queryObj;

  ApiAccess.findOneAndUpdate(
      { user: sessionUserID },
      updateObj,
      { new: true },
      function (error, matchingApiAccess) {
        if (error) throw error;
        if (matchingApiAccess === null) throw new Error('No user to save token to'); //todo how to handle this?
      });
}

module.exports = updateSocialChannelProfile;
