var User = require('../schemas/User');
var createApiAccess = require('./../ApiAccess/createApiAccess');
var newUser;

/**
 * anropas med auth0-callback och har auth0s profile-objekt som param
 * User.findOne söker i databasen efter en användare som matchar profile-objektets id
 * om matchande id finns i databasen så skickas profilinformationen vidare
 * om matchande id inte finns i databasen så skapas en ny användare i databasen
 * samt ett tomt ApiAccess-objekt som refererar till User i vilket sedan accesstoken m.m. sparas
 * @param profile
 */
function handleLogin(profile) {
  User.findOne({ profileId: profile.id })
    .then(function (matchingUser) {
    if (matchingUser === null) {
      newUser = new User({
        profileId: profile.id,
        displayName: profile.displayName,
        admin: profile.admin,
      });

      newUser.save(function (error) {
        if (error) throw error;
      });

      createApiAccess(newUser.profileId);
    }
  }).catch(function (error) {
    console.log(error);
  });
}

module.exports = handleLogin;
