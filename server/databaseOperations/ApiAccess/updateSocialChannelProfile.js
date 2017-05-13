var ApiAccess = require('./../../../model/schemas/ApiAccess');
//  var createReport = require('./../Report/create');

function updateSocialChannelProfile(sessionUserID, profile) {
/*
either saves or updates an access token into
database when authorizing against facebook/google/etc.
*/
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
    function (err, matchingApiAccess) {
      if (err) console.error(err);

      if (matchingApiAccess === null) console.error('no user to save token to'); // todo how to handle this?
      if (matchingApiAccess) console.log(matchingApiAccess);
    });
}

module.exports = updateSocialChannelProfile;
