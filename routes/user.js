const express = require('express');
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const router = express.Router();

var customerReportSettings = require('../client/js/lib/customerReportSettings.js');


/* GET user profile. */
router.get('/', ensureLoggedIn, function (req, res, next) {
  res.render('dashboard', { user: req.user });
});

router.get('/mediaChannels', ensureLoggedIn, function (req, res, next) {
  res.render('mediaChannels', { user: req.user });

  router.get('/dashboard', ensureLoggedIn, function (req, res, next) {
/*
  Skicka objekt med information från Auth0 om vilka sociala medier som är aktiverade för användaren
*/
  res.render('dashboard', { user: req.user });
});

router.post('/preview', ensureLoggedIn, customerReportSettings);

router.get('/preview', ensureLoggedIn, function (req, res, next) {
  res.render('preview', { user: req.user });
});

router.get('/reports', ensureLoggedIn, function (req, res, next) {
  res.render('reports', { user: req.user });
});

router.get('/report/:id', ensureLoggedIn, function (req, res, next) {
  res.render('report', { user: req.user });

});

module.exports = router;
