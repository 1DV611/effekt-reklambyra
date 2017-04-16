const express = require('express');
const passport = require('passport');
const router = express.Router();

const env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback',
};

router.get('/', function (req, res, next) {
  res.render('home', { title: 'Express', env: env });
});

router.get('/login',
    function (req, res) {
      res.render('login', { env: env });
    });

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/callback',
    passport.authenticate('auth0', { failureRedirect: '/url-if-something-fails' }),
    function (req, res) {
      res.redirect(req.session.returnTo || '/user');
    });

module.exports = router;
