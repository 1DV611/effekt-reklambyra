var ApiAccess = require('./../../../model/schemas/ApiAccess');

/**
 * Sparar eller uppdaterar accessinformation för sociala medier
 * vid autentisering mot exempelvis facebook/twitter m.m.
 * @param sessionUserID
 * @param profile
 */
function updateSocialChannelProfile(sessionUserID, profile) {
  var queryObj = {
    accessToken: profile.accessToken,
    refreshToken: profile.refreshToken,
    id_token: profile.id_token,
    extraParams: profile.extraParams,
    profile: {
      _json: profile._json,
      _raw: profile._raw
    }
  };

  ApiAccess.findOneAndUpdate(
    { user: sessionUserID },
    { updated: Date.now(), queryObj: queryObj },
    { new: true },
    function (error, matchingApiAccess) {
      if (error) throw error;
      if (matchingApiAccess === null) throw new Error('No user to save token to'); // todo how to handle this?
    });
}

module.exports = updateSocialChannelProfile;
