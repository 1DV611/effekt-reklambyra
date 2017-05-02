const express = require('express');
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const router = express.Router();
const googleAPI = require('../model/googleApi');
const instagramAPI = require('../model/instagramAPI');

let standardRedirectSettings = {
  successRedirect: '/auth/social-channel-token',
  failureRedirect: 'fail',
};

//https://developers.google.com/identity/protocols/googlescopes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/adsense.readonly', 'https://www.googleapis.com/auth/youtube.readonly']
}));

router.get('/google/callback', passport.authenticate('google', standardRedirectSettings));

router.get('/instagram', passport.authenticate('instagram', {
  scope: ['likes', 'basic', 'public_content', 'follower_list', 'comments', 'relationships'], state: 'a state'
}));

router.get('/instagram/callback', passport.authenticate('instagram', standardRedirectSettings));

router.get('/social-channel-token', function (req, res, next) {
  sendToApi(req.user);
  res.redirect('/user/dashboard');
});

let sendToApi = function (profile) {

  switch (profile.provider) {

    case 'google':
      googleAPI(profile.accessToken);
      break;

    case 'instagram':
      instagramAPI(profile.accessToken);
      break;
  }

};

module.exports = router;
