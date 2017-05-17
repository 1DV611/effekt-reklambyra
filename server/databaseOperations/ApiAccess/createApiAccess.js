var ApiAccess = require('./../../../model/schemas/ApiAccess');

/**
 * skapar ApiAccess-objekt som refererar till en användare (User),
 * ett ApiAccess-objekt per användare
 * @param newUserProfileId
 */
function createApiAccess(newUserProfileId) {
  var newApiAccess = new ApiAccess({
    user: newUserProfileId
  });

  newApiAccess.save(function (error) {
    if (error) throw error;
  });
}

module.exports = createApiAccess;
