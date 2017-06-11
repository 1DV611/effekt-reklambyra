var express = require('express');
var passport = require('passport');
var router = express.Router();

//  autentiseringsinformation för auth0
var env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback',
};

//  navigation till första sidan
router.get('/',
  function (req, res) {
    res.render('home', { title: 'Express', env: env });
  });

//  öppnar auth0-popup
router.get('/login',
    function (req, res) {
      res.render('login', { env: env });
    });

//  loggar ut användare och skickar därefter användaren till startsidan
router.get('/logout',
  function (req, res) {
    req.logout();
    res.redirect('/');
  });

/** om användaren matchar en användare i auth0 registret skickas hen till /user/
 * annars till failureRedirect
 */
router.get('/callback',
    passport.authenticate('auth0', { failureRedirect: '/url-if-something-fails' }),
    function (req, res) {
      req.session.authZeroUserID = req.user.id;
      req.session.admin = req.user.admin;
      res.redirect(req.session.returnTo || '/user');
    });

module.exports = router;
