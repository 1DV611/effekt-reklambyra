var User = require('./../schemas/User');
var usernames;

//  Returnerar alla användarnamn under angiven månad och år
function getUsers() {
  return new Promise(function (resolve, reject) {
    User.find({})
    .then(function (users) {
      usernames = [];

      users.forEach(function (user) {
        usernames.push({
          profileId: user.profileId,
          displayName: user.displayName,
          admin: user.admin,
        });
      });

      resolve(usernames);
    }).catch(function (error) {
      reject(error);
    });
  });
}

module.exports = getUsers;
