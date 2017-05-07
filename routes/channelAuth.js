var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var router = express.Router();
var db = require('../model/db');

var googleAPI = require('../model/googleAPI');
var instagramAPI = require('../model/instagramAPI');
var linkedinAPI = require('../model/linkedinAPI');
var twitterAPI = require('../model/twitterAPI');
var facebookAPI = require('../model/facebookAPI');

var dotenv = require('dotenv');
dotenv.load();

// where to redirect after the callback from each provider. Using this as standard, can send in an object if you wish a particular provider handled differently.
var standardRedirectSettings = {
  failureRedirect: process.env.BASE_URL + '/auth/fail',
  successRedirect: process.env.BASE_URL + '/auth/social-channel-token',
};

//https://developers.google.com/identity/protocols/googlescopes
//you have to define correct scopes for the auth to work, you must also enable each API in google dev console, and select that scope, otherwise auth silently fails.
router.get('/google', ensureLoggedIn, passport.authenticate('google', {
  scope: ['profile', 'https://www.googleapis.com/auth/analytics.readonly', 'https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/adsense.readonly', 'https://www.googleapis.com/auth/youtube.readonly']
}));

router.get('/google/callback', ensureLoggedIn, passport.authenticate('google', standardRedirectSettings));

router.get('/instagram', ensureLoggedIn, passport.authenticate('instagram', {
  scope: ['likes', 'basic', 'public_content', 'follower_list', 'comments', 'relationships'],
}));

router.get('/instagram/callback', ensureLoggedIn, passport.authenticate('instagram', standardRedirectSettings));

router.get('/linkedin', ensureLoggedIn, passport.authenticate('linkedin', {
  scope: ['r_basicprofile', 'w_share', 'r_emailaddress', 'rw_company_admin']
}));

router.get('/linkedin/callback', ensureLoggedIn, passport.authenticate('linkedin', standardRedirectSettings));

router.get('/twitter', ensureLoggedIn, passport.authenticate('twitter'));

router.get('/twitter/callback', ensureLoggedIn, passport.authenticate('twitter', standardRedirectSettings));

router.get('/facebook', ensureLoggedIn, passport.authenticate('facebook'));

router.get('/facebook/callback', ensureLoggedIn, passport.authenticate('facebook', standardRedirectSettings));

//facebook also has a callback for when a user deauthorizes our application
router.get('/facebook/deauth', function (req, res) {
  console.log('fb deauth' + req.user);
});

// this is where all successful auths end up, req.user has the entire profile. req.user.accessToken = token
router.get('/social-channel-token', ensureLoggedIn, function (req, res, next) {
  sendToApi(req.user);
  db.handleToken(req.session.authZeroUserID, req.user);
  res.redirect('/user/dashboard');
});

router.get('/fail', function (req, res, next) {
  console.log('auth failed');
});

//temporary to send each token onto the api
var sendToApi = function (profile) {
  console.log(profile);
  switch (profile.provider) {
    case 'google':
      googleAPI(profile.accessToken);
      break;

    case 'instagram':
      instagramAPI(profile);
      break;

    case 'linkedin':
      linkedinAPI(profile.accessToken);
      break;

    case 'twitter':
      twitterAPI(profile);
      break;

    case 'facebook':
      facebookAPI(profile);
      break;
  }

};

module.exports = router;
