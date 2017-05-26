var express = require('express');
var passport = require('passport');
var dotenv = require('dotenv');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var router = express.Router();
var updateSocialChannelProfile = require('../server/databaseOperations/ApiAccess/updateSocialChannelProfile');
var standardRedirectSettings;
dotenv.load();

/*
where to redirect after the callback from each provider.
Using this as standard, can send in an object if you wish a
particular provider handled differently.
 */
standardRedirectSettings = {
  failureRedirect: process.env.BASE_URL + '/auth/fail',
  successRedirect: process.env.BASE_URL + '/auth/social-channel-token'
};

/**
 * https://developers.google.com/identity/protocols/googlescopes
 * you have to define correct scopes for the auth to work, you must also enable each API in
 * google dev console, and select that scope, otherwise auth silently fails.
 */
router.get('/google',
  ensureLoggedIn,
  passport.authenticate('google', {
    scope: ['profile', 'https://www.googleapis.com/auth/analytics.readonly',
      'https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/adsense.readonly',
      'https://www.googleapis.com/auth/youtube.readonly']
  }));

router.get('/google/callback',
  ensureLoggedIn,
  passport.authenticate('google', standardRedirectSettings));

router.get('/instagram',
  ensureLoggedIn,
  passport.authenticate('instagram', {
    scope: ['likes', 'basic', 'public_content', 'follower_list', 'comments', 'relationships']
  }));

router.get('/instagram/callback',
  ensureLoggedIn,
  passport.authenticate('instagram', standardRedirectSettings));

router.get('/linkedin',
  ensureLoggedIn,
  passport.authenticate('linkedin', {
    scope: ['r_basicprofile', 'w_share', 'r_emailaddress', 'rw_company_admin']
  }));

router.get('/linkedin/callback',
  ensureLoggedIn,
  passport.authenticate('linkedin', standardRedirectSettings));

router.get('/twitter',
  ensureLoggedIn,
  passport.authenticate('twitter'));

router.get('/twitter/callback',
  ensureLoggedIn,
  passport.authenticate('twitter', standardRedirectSettings));

router.get('/facebook',
  ensureLoggedIn,
  passport.authenticate('facebook'));

router.get('/facebook/callback',
  ensureLoggedIn,
  passport.authenticate('facebook', standardRedirectSettings));

//  facebook also has a callback for when a user deauthorizes our application
router.get('/facebook/deauth',
  function (req, res) {
    console.log('fb deauth ' + req.user);
  });

router.get('/addthis',
  function (req, res) {
    var api = {
      title: 'AddThis',
      name: 'addthis',
      inputs: [
        { title: 'Username', name: 'username' },
        { title: 'Password', name: 'password' }
      ]
    };
    res.render('authInput', { api: api });
  });

router.post('/addthis/callback',
  function (req, res) {
    console.log(req.body.username);
    console.log(req.body.password);
    // TODO Save AddThis req.body.Username and req.body.Password to database
    res.redirect('/user/settings');
  });

router.get('/tynt',
  function (req, res) {
    var api = {
      title: 'Tynt/33Across',
      name: 'tynt',
      inputs: [
        { title: 'Secret API Key', name: 'secret_api_key' },
        { title: 'Site GUID', name: 'site_guid'}
      ]
    };
    res.render('authInput', { api: api });
  });

router.post('/tynt/callback',
  function (req, res) {
    console.log(req.body.secret_api_key);
    console.log(req.body.site_guid);
    // TODO Save Tynt req.body.secret_api_key and req.body.site_guid to database
    res.redirect('/user/settings');
  });

//  TODO: Google sparas i apiAccess MEN node rejection error visas i konsolen? och redirectar inte
/** this is where all successful auths end up, req.user has the entire profile.
 * req.user.accessToken = token
 */
router.get('/social-channel-token',
  ensureLoggedIn,
  function (req, res) {
    updateSocialChannelProfile(req.session.authZeroUserID, req.user);
    res.redirect('/user/settings');
  });

router.get('/fail',
  function (req, res) {
    console.log('auth failed');
  });

module.exports = router;
