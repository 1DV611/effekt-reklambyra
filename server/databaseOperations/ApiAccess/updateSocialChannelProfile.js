var ApiAccess = require('../schemas/ApiAccess');
var encrypt = require('../../helpers/encrypt');
var queryObj;
var updateObj;
var access;

/**
 * Sparar och uppdaterar accessinformation för sociala medier
 * vid autentisering mot exempelvis facebook/twitter m.m.
 * Om profile enbart innehåller propertyn provider tas denna propertyn bort
 * @param sessionUserID
 * @param profile
 */
function updateSocialChannelProfile(sessionUserID, profile) {
  updateObj = {
    updated: Date.now()
  };

  //  If - Inaktiverar medier som anges i array för användaren
  //  Else - sparar och uppdaterar medier för användaren
  if (Array.isArray(profile)) {
    updateObj = {
      $unset: {}
    };

    profile.forEach(function (media) {
      updateObj.$unset[media] = 1;
    });
  } else {

    access = {
      username: encrypt.encryptText(profile.username),
      password: encrypt.encryptText(profile.password),
      secret_api_key: encrypt.encryptText(profile.secret_api_key),
      site_guid: encrypt.encryptText(profile.site_guid),
      accessToken: encrypt.encryptText(profile.accessToken),
      refreshToken: encrypt.encryptText(profile.refreshToken),
      id_token: encrypt.encryptText(profile.id_token),
      extraParams: {
        access_token: encrypt.encryptText(profile.extraParams.access_token),
        token_type: encrypt.encryptText(profile.extraParams.token_type),
        expires_in: encrypt.encryptText(profile.extraParams.expires_in.toString()),
        id_token: encrypt.encryptText(profile.extraParams.id_token)
      },
      profile: encrypt.encryptText(JSON.stringify({
        _json: profile._json,
        _raw: profile._raw
      }))
    };

    queryObj = {
      provider: profile.provider,
      access: access
    };

    updateObj[queryObj.provider] = queryObj;
  }

  ApiAccess.findOneAndUpdate(
    { user: sessionUserID },
    updateObj,
    { new: true },
    function (error, matchingApiAccess) {
      if (error) console.log(error);
      if (matchingApiAccess === null) throw new Error('No user to save token to'); //todo how to handle this?
    });
}

module.exports = updateSocialChannelProfile;
