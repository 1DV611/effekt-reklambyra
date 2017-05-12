var User = require('./../../../model/schemas/User');
var createApiAccess = require('./../ApiAccess/create');
var newUser;

function handleLogin(profile) {
  // called with auth0 callback, either creates the user or sends the matching credentials onwards.
  User.findOne({ profileId: profile.id }).then(function (matchingUser) {
    if (matchingUser === null) {
      console.log('saving user');

      newUser = new User({
        profileId: profile.id,
        displayName: profile.displayName,
        admin: profile.admin
      });

      newUser.save();

      createApiAccess(newUser.profileId);
    } else {
      console.log('user exists in db');
    }
  }).catch(function (error) {
    console.error(error);
  });
}

module.exports = handleLogin;
