const express = require('express');
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const router = express.Router();
const googleApi = require('../model/googleApi');

//https://developers.google.com/identity/protocols/googlescopes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'https://www.googleapis.com/auth/analytics.readonly', 'https://www.googleapis.com/auth/adsense.readonly', 'https://www.googleapis.com/auth/youtube.readonly'] }));

router.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/auth/social-channel-token',
  failureRedirect: 'fail',
}));

router.get('/social-channel-token', function (req, res, next) {
  sendToApi(req.user);
  res.redirect('/user/dashboard');

});

module.exports = router;


let sendToApi = function (profile) {

  switch (profile.provider) {

    case 'google':
      googleApi(profile.accessToken);
      break;
  }

};