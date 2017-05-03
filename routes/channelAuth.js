const express = require('express');
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const router = express.Router();
const googleAPI = require('../model/googleApi');
const instagramAPI = require('../model/instagramAPI');
const linkedinAPI = require('../model/linkedinAPI');
const dotenv = require('dotenv');

dotenv.load();

let standardRedirectSettings = {
  failureRedirect: process.env.BASE_URL + '/auth/fail',
};

//https://developers.google.com/identity/protocols/googlescopes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'https://www.googleapis.com/auth/analytics.readonly', 'https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/adsense.readonly', 'https://www.googleapis.com/auth/youtube.readonly']
}));

router.get('/google/callback', function (req, res, next) {
  passport.authenticate('google', standardRedirectSettings)(req, res, function () {
    res.redirect('/auth/social-channel-token');
  });
});

router.get('/instagram', passport.authenticate('instagram', {
  scope: ['likes', 'basic', 'public_content', 'follower_list', 'comments', 'relationships'],
  state: 'a state'
}));

router.get('/instagram/callback', passport.authenticate('instagram', standardRedirectSettings));

router.get('/linkedin', passport.authenticate('linkedin', {
  scope: ['r_basicprofile', 'w_share', 'r_emailaddress', 'rw_company_admin']
}));

router.get('linkedin/callback', passport.authenticate('linkedin', standardRedirectSettings));

router.get('/social-channel-token', function (req, res, next) {
  //console.log(req.user);
  sendToApi(req.user);
  res.redirect('/user/dashboard');
});

router.get('/fail', function (req, res, next) {
  console.log('auth failed');
});


let sendToApi = function (profile) {
  console.log(profile);
  switch (profile.provider) {
    case 'google':
      googleAPI(profile.accessToken);
      break;

    case 'instagram':
      instagramAPI(profile.accessToken);
      break;

    case 'linkedin':
      console.log(profile);
      linkedinAPI(profile.accessToken);
      break;
  }

};

module.exports = router;
