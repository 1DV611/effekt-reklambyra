const googleAPI = require('./../../../model/googleAPI');

function resultsFromGoogleApi(req, res, next) {

  googleAPI(req.user.accessToken, function (results) {
    res.render('example', { user: req.user, results: results });
  });
}

module.exports = resultsFromGoogleApi;
