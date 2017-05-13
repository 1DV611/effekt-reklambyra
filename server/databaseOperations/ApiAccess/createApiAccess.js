var ApiAccess = require('./../../../model/schemas/ApiAccess');

function createApiAccess(newUserProfileId) {
  var newApiAccess = new ApiAccess({
    user: newUserProfileId,
    authentication: {}
  });

  newApiAccess.save();
}

module.exports = createApiAccess;
