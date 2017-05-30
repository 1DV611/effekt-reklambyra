var ApiAccess = require('../schemas/ApiAccess');
var encrypt = require('../../helpers/encrypt');
var queryObj;
var updateObj;
var access = {};

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
    console.log(JSON.stringify(profile));

    if (profile.username) {
      access.username = encrypt.encryptText(profile.username);
    }

    if (profile.password) {
      access.password = encrypt.encryptText(profile.password);
    }

    if (profile.pubID) {
      access.pubID = encrypt.encryptText(profile.pubID);
    }

    if (profile.secret_api_key) {
      access.secret_api_key = encrypt.encryptText(profile.secret_api_key);
    }

    if (profile.site_guid) {
      access.site_guid = encrypt.encryptText(profile.site_guid);
    }

    if (profile.accessToken) {
      access.accessToken = encrypt.encryptText(profile.accessToken);
    }

    if (profile.refreshToken) {
      access.refreshToken = encrypt.encryptText(profile.refreshToken);
    }

    if (profile.id_token) {
      access.id_token = encrypt.encryptText(profile.id_token);
    }

    if (profile.extraParams) {
      access.extraParams = {};

      if (profile.extraParams.user) {
        access.extraParams.user = encrypt.encryptText(profile.extraParams.user);
      }

      if (profile.extraParams.access_token) {
        access.extraParams.access_token = encrypt.encryptText(profile.extraParams.access_token);
      }

      if (profile.extraParams.token_type) {
        access.extraParams.token_type = encrypt.encryptText(profile.extraParams.token_type);
      }

      if (profile.extraParams.expires_in) {
        access.extraParams.expires_in = encrypt.encryptText(profile.extraParams.expires_in.toString());
      }

      if (profile.extraParams.id_token) {
        access.extraParams.id_token = encrypt.encryptText(profile.extraParams.id_token);
      }
    }

    if (profile.profile) {
        access.profile = encrypt.encryptText(JSON.stringify({
          _json: profile._json,
          _raw: profile._raw
        }));
      }

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
